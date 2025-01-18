const fs = require('fs').promises;
const path = require('path');
const { PDFDocument } = require('pdf-lib');

async function generateFieldMappings() {
    const fieldMappings = {};
    
    try {
        // Read PDF file
        const pdfPath = path.join(__dirname, 'Request-For-Order-fillable.pdf');
        const pdfBytes = await fs.readFile(pdfPath);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        
        // Get form fields
        const form = pdfDoc.getForm();
        const fields = form.getFields();
        
        // Log all available fields for inspection
        console.log('Available fields:');
        fields.forEach(field => {
            const fieldName = field.getName();
            const fieldType = field.constructor.name;
            console.log(`${fieldName} (${fieldType})`);
        });
        
        // Create mappings based on field names and types
        const mappings = {};
        fields.forEach(field => {
            const fieldName = field.getName();
            const humanReadableName = createHumanReadableKey(fieldName, field);
            mappings[humanReadableName] = fieldName;
        });
        
        // Write mappings to a JSON file
        await fs.writeFile(
            path.join(__dirname, 'field_mappings.json'),
            JSON.stringify(mappings, null, 2)
        );
        
        console.log('Field mappings generated successfully!');
        
    } catch (error) {
        console.error('Error generating field mappings:', error);
    }
}

function createHumanReadableKey(fieldName, field) {
    // Common patterns in PDF form fields
    const patterns = {
        // Personal Information
        name: /(?:full)?name|nombre/i,
        email: /email|correo/i,
        phone: /phone|telefono|tel/i,
        address: /address|direccion/i,
        city: /city|ciudad/i,
        state: /state|estado/i,
        zip: /zip|postal/i,
        
        // Legal Fields
        caseNumber: /case.*num|numero.*caso/i,
        courtName: /court.*name|nombre.*corte/i,
        attorney: /attorney|abogado/i,
        plaintiff: /plaintiff|demandante/i,
        defendant: /defendant|demandado/i,
        
        // Dates
        date: /date|fecha/i,
        filingDate: /filing.*date|fecha.*presentacion/i,
        hearingDate: /hearing.*date|fecha.*audiencia/i,
        
        // Common Form Elements
        signature: /signature|firma/i,
        checkbox: /check|box|casilla/i,
        
        // Add more patterns as needed
    };
    
    // Try to match field name against patterns
    for (const [key, pattern] of Object.entries(patterns)) {
        if (pattern.test(fieldName)) {
            return key;
        }
    }
    
    // If no pattern matches, create a fallback name
    // Remove common PDF field prefixes/suffixes
    let humanName = fieldName
        .replace(/^(Fill|Check|Text|Box|Field)/i, '')
        .replace(/\d+$/, '')
        .toLowerCase();
    
    // Convert camelCase or snake_case to spaces
    humanName = humanName
        .replace(/([A-Z])/g, ' $1')
        .replace(/_/g, ' ')
        .trim();
    
    // Convert to camelCase for JavaScript
    return humanName
        .split(' ')
        .map((word, index) => 
            index === 0 ? word.toLowerCase() : 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join('');
}

// Run the generator
generateFieldMappings();
