import { promises as fs } from 'fs';
import { join, dirname, relative } from 'path';
import PDFParser from 'pdf2json';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Add sleep function
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Add this before the function
function getFormattedDate() {
  const date = new Date();
  return date.getFullYear() +
    String(date.getMonth() + 1).padStart(2, '0') +
    String(date.getDate()).padStart(2, '0');
}

async function generateFieldMappings() {
    try {
        const formsDir = join(__dirname, 'forms');
        const forms = [];

        // Function to copy PDF to destination
        async function copyPDFToDestination(sourcePath, formNumber) {
            if (!formNumber) return;

            const targetDir = join(__dirname, '..', 'california', 'family-law', formNumber);
            const targetFile = join(targetDir, 'Request-For-Order-fillable.pdf');
            const promptsSourceDir = join(__dirname, 'prompts');
            const promptsTargetDir = join(targetDir, 'prompts');

            try {
                // Create directories if they don't exist
                await fs.mkdir(targetDir, { recursive: true });
                await fs.mkdir(promptsTargetDir, { recursive: true });

                // Use the full source path
                const sourceFile = join(formsDir, sourcePath);

                // Copy the PDF file
                await fs.copyFile(sourceFile, targetFile);
                console.log(`Copied PDF - ${formNumber}`);

                // Copy prompt files
                const promptFiles = ['step1-ask-llm-for-most-efficient-message-to-give-to-the-user.txt', 
                                   'step2-ask-llm-to-apply-user-input-to-the-current-state-to-arrive-at-new-state.txt'];
                
                for (const promptFile of promptFiles) {
                    const promptSource = join(promptsSourceDir, promptFile);
                    const promptTarget = join(promptsTargetDir, promptFile);
                    try {
                        await fs.copyFile(promptSource, promptTarget);
                        console.log(`Copied prompt file ${promptFile} - ${formNumber}`);
                    } catch (error) {
                        console.error(`Error copying prompt file ${promptFile} for form ${formNumber}:`, error);
                    }
                }
            } catch (error) {
                console.error(`Error copying files for form ${formNumber}:`, error);
            }
        }

        // Function to parse a single PDF file
        async function parsePDF(filePath) {
            return new Promise((resolve, reject) => {
                const pdfParser = new PDFParser();

                pdfParser.on('pdfParser_dataReady', async (pdfData) => {
                    try {
                        // Get text from first page
                        const firstPageText = pdfData.Pages[0]?.Texts
                            .map(text => decodeURIComponent(text.R[0]?.T || ''))
                            .join(' ');

                        // Extract form number from text
                        let formNumber = '';
                        const formNumberMatch = firstPageText.match(/\b(FL|MC|SUBP|G|EJT|CAND-GO|LACIV|CV)-\d+(-[A-Z])?(-[A-Z])?\b/);
                        if (formNumberMatch) {
                            formNumber = formNumberMatch[0];
                        } else {
                            // Try to extract form number from filename if it's in braces
                            const braceMatch = filePath.match(/\{([^}]+)\}/);
                            if (braceMatch) {
                                formNumber = braceMatch[1];
                            }
                        }

                        const title = firstPageText.substring(0, 100).trim();
                        const metadata = {
                            formNumber,
                            title,
                            path: relative(formsDir, filePath)
                        };

                        // Copy PDF and generate mappings if form number exists
                        if (formNumber) {
                            console.log(`Processing form ${formNumber}...`);
                            await copyPDFToDestination(metadata.path, formNumber);
                            await generateInitialAIPrompt(formNumber, filePath);
                            await updateFormsListJson(formNumber, metadata);
                            // Add 5 second sleep between forms
                            console.log(`Completed processing form ${formNumber}\n`);
                            console.log(`Sleeping for 5 seconds...`);
                            await sleep(2000);
                        }

                        resolve(metadata);
                    } catch (error) {
                        console.error(`Error processing PDF ${filePath}:`, error);
                        resolve(null);
                    }
                });

                pdfParser.on('pdfParser_dataError', (error) => {
                    console.error(`Error reading PDF ${filePath}:`, error);
                    resolve(null);
                });

                pdfParser.loadPDF(filePath);
            });
        }

        // Function to recursively find PDF files
        async function findPDFFiles(dir) {
            const files = await fs.readdir(dir);
            
            for (const file of files) {
                const filePath = join(dir, file);
                const stat = await fs.stat(filePath);
                
                if (stat.isDirectory()) {
                    await findPDFFiles(filePath);
                } else if (file.toLowerCase().endsWith('.pdf')) {
                    const metadata = await parsePDF(filePath);
                    if (metadata) {
                        forms.push(metadata);
                        console.log(`Found form: ${metadata.formNumber}`);
                    }
                }
            }
        }

        await findPDFFiles(formsDir);
        const outputPath = join(dirname(formsDir), 'forms_metadata.json');
        await fs.writeFile(outputPath, JSON.stringify(forms, null, 2));
        
        console.log(`\nProcessed ${forms.length} forms`);
        console.log(`Results written to: ${outputPath}`);

    } catch (error) {
        console.error('Error generating field mappings:', error);
    }
}

// Add this function after the parsePDF function
async function generateInitialAIPrompt(formNumber, pdfPath) {
    try {
        // Read the PDF file and convert to base64
        const pdfBuffer = await fs.readFile(pdfPath);
        const pdfBase64 = `data:application/pdf;base64,${pdfBuffer.toString('base64')}`;

        // Read the prompt template
        const promptPath = join(__dirname, 'prompt.txt');
        const promptTemplate = await fs.readFile(promptPath, 'utf-8');
        
        // Replace {pdf_form_name} with formNumber in the template
        const processedTemplate = promptTemplate.replace('{pdf_form_name}', formNumber);
        
        // Create the system prompt
        const systemPrompt = `${processedTemplate}`;
        //console.log(systemPrompt);
        
        // Make API call to py.associateattorney.com - openai_direct.py 
        const response = await fetch('http://localhost:3002/associate-attorney/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                pdf_base64: pdfBase64,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: "Please analyze this form and generate the JSON structure as specified in the prompt." }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`API call failed with status: ${response.status}`);
        }

        const aiResponse = await response.json();
        console.log(`AI Response for form ${formNumber}`);
        
        // Extract and parse JSON from response
        let jsonContent;
        try {
            const content = aiResponse.content;
            
            // First try direct parse
            try {
                jsonContent = typeof content === 'string' ? JSON.parse(content) : content;
            } catch (e) {
                // Look for JSON between code blocks
                const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
                if (jsonMatch && jsonMatch[1]) {
                    jsonContent = JSON.parse(jsonMatch[1]);
                } else {
                    // Try to find first { to last }
                    const jsonContent = content.match(/\{[\s\S]*\}/);
                    if (jsonContent) {
                        jsonContent = JSON.parse(jsonContent[0]);
                    } else {
                        throw new Error('No valid JSON structure found in response');
                    }
                }
            }

            // Basic validation of required structure
            if (!jsonContent.form_metadata || !jsonContent.sections) {
                throw new Error('Invalid JSON structure in response');
            }
        } catch (error) {
            console.error(`Error parsing JSON content for form ${formNumber}:`, error);
            console.error('Response content:', aiResponse.content);
            return;
        }
        
        // Save response to a file
        const targetDir = join(__dirname, '..', 'california', 'family-law', formNumber);
        const datePrefix = getFormattedDate();
        const outputPath = join(targetDir, `${datePrefix}_field_mappings.json`);
        
        await fs.mkdir(targetDir, { recursive: true });
        await fs.writeFile(outputPath, JSON.stringify(jsonContent, null, 2));
        console.log(`Generated field mappings for form ${formNumber}`);

        // Add this function after generateInitialAIPrompt
        await updateFormsListJson(formNumber, jsonContent);

    } catch (error) {
        console.error(`Error generating AI prompt for form ${formNumber}:`, error);
    }
}

// Add this function after generateInitialAIPrompt
async function updateFormsListJson(formNumber, metadata) {
    try {
        // Read existing forms_list.json from public folder
        const formsListPath = join(__dirname, '..', '..', 'forms_list.json');
        const formsListContent = await fs.readFile(formsListPath, 'utf-8');
        const formsList = JSON.parse(formsListContent);

        // Create form entry
        const formEntry = {
            id: formNumber,
            name: "Request-For-Order-",
            title: metadata.form_metadata?.title || metadata.title || `Form ${formNumber}`,
            path: `california/family-law/${formNumber}/Request-For-Order-fillable.pdf`,
            field_mappings_file: `${getFormattedDate()}_field_mappings.json`
        };

        // Ensure california and family-law paths exist
        if (!formsList.jurisdictions.california) {
            formsList.jurisdictions.california = { areas: {} };
        }
        if (!formsList.jurisdictions.california.areas['family-law']) {
            formsList.jurisdictions.california.areas['family-law'] = { forms: [] };
        }

        // Check if form already exists and update or add
        const forms = formsList.jurisdictions.california.areas['family-law'].forms;
        const existingIndex = forms.findIndex(f => f.id.toLowerCase() === formEntry.id.toLowerCase());
        
        if (existingIndex >= 0) {
            forms[existingIndex] = formEntry;
        } else {
            forms.push(formEntry);
        }

        // Write updated forms_list.json
        await fs.writeFile(formsListPath, JSON.stringify(formsList, null, 2));
        console.log(`Updated forms_list.json for form ${formNumber}`);

    } catch (error) {
        console.error(`Error updating forms_list.json for form ${formNumber}:`, error);
    }
}

// Run the generator
generateFieldMappings();
