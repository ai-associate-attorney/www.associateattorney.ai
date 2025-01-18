const fs = require('fs').promises;
const path = require('path');
const { PDFDocument } = require('pdf-lib');

async function generateFieldMappings() {
    try {
        const pdfPath = path.join(__dirname, 'Request-For-Order-fillable.pdf');
        const pdfBytes = await fs.readFile(pdfPath);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        
        const form = pdfDoc.getForm();
        const fields = form.getFields();
        
        // Track unmapped fields for human review
        let unmappedTextCounter = 1;
        let unmappedCheckboxCounter = 1;
        const mappings = {};
        
        fields.forEach(field => {
            const fieldName = field.getName();
            const fieldType = field.constructor.name;
            
            if (!fieldName) return;
            
            let mappingKey;
            if (fieldType === 'PDFTextField') {
                mappingKey = createTextFieldMapping(fieldName);
                if (mappingKey.startsWith('textField_')) {
                    mappingKey = `needs_human_readable_name_text_${unmappedTextCounter++}`;
                }
            } else if (fieldType === 'PDFCheckBox') {
                mappingKey = createCheckboxMapping(fieldName);
                if (mappingKey.startsWith('checkbox_')) {
                    mappingKey = `needs_human_readable_name_checkbox_${unmappedCheckboxCounter++}`;
                }
            } else if (fieldType === 'PDFButton') {
                mappingKey = fieldName.toLowerCase();
            }
            
            if (mappingKey) {
                mappings[mappingKey] = fieldName;
            }
        });
        
        // Sort mappings by key for better readability
        const sortedMappings = {};
        Object.keys(mappings).sort().forEach(key => {
            sortedMappings[key] = mappings[key];
        });
        
        await fs.writeFile(
            path.join(__dirname, 'field_mappings.json'),
            JSON.stringify(sortedMappings, null, 2)
        );
        
        console.log('\nField mappings generated successfully!');
        console.log(`Total fields mapped: ${Object.keys(sortedMappings).length}`);
        console.log(`Text fields needing human review: ${unmappedTextCounter - 1}`);
        console.log(`Checkbox fields needing human review: ${unmappedCheckboxCounter - 1}`);
        
    } catch (error) {
        console.error('Error generating field mappings:', error);
    }
}

function createTextFieldMapping(fieldName) {
    // Common text field patterns
    const textFieldPatterns = {
        attorneyName: /^FillText(123|122)$/,
        partyName: /^FillText(121|120)$/,
        caseNumber: /^FillText119$/,
        courtInfo: /^FillText(118|117|116)$/,
        hearingInfo: /^FillText(115|114|113)$/,
        address: /^FillText(112|111|110)$/,
        phone: /^FillText(109|108)$/,
        email: /^FillText107$/,
        // Add more patterns as needed
    };

    for (const [key, pattern] of Object.entries(textFieldPatterns)) {
        if (pattern.test(fieldName)) {
            return key;
        }
    }

    // Fallback: create a generic mapping
    return `textField_${fieldName}`;
}

function createCheckboxMapping(fieldName) {
    // Common checkbox patterns
    const checkboxPatterns = {
        consentCheckbox: /^CheckBox(197|196)$/,
        agreementCheckbox: /^CheckBox(195|194)$/,
        // Add more patterns as needed
    };

    for (const [key, pattern] of Object.entries(checkboxPatterns)) {
        if (pattern.test(fieldName)) {
            return key;
        }
    }

    // Fallback: create a generic mapping
    return `checkbox_${fieldName}`;
}

// Run the generator
generateFieldMappings();
