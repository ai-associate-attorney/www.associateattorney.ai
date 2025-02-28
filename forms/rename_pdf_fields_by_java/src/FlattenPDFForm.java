import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.*;
import org.apache.pdfbox.pdmodel.interactive.form.*;

public class FlattenPDFForm {
    public static void main(String[] args) {
        File inputDir = new File("input-pdf-files");
        File outputDir = new File("output-pdf-files");

        if (!outputDir.exists()) {
            outputDir.mkdirs(); // Create output directory if it doesn't exist
        }

        File[] pdfFiles = inputDir.listFiles((dir, name) -> name.toLowerCase().endsWith(".pdf"));
        if (pdfFiles == null || pdfFiles.length == 0) {
            System.out.println("❌ No PDF files found in the input directory.");
            return;
        }

        for (File pdfFile : pdfFiles) {
            String inputPdfPath = pdfFile.getAbsolutePath();
            String outputPdfPath = new File(outputDir, pdfFile.getName()).getAbsolutePath();

            try {
                PDDocument document = Loader.loadPDF(new File(inputPdfPath));
                document.setAllSecurityToBeRemoved(true); // Remove encryption

                PDAcroForm acroForm = document.getDocumentCatalog().getAcroForm();

                if (acroForm != null) {
                    System.out.println("🔄 Renaming form fields in " + pdfFile.getName() + "...");
                    Map<String, Integer> fieldCounters = new HashMap<>();
                    renameFields(acroForm.getFields(), fieldCounters);
                } else {
                    System.out.println("❌ No form fields found in " + pdfFile.getName() + ".");
                }

                document.save(outputPdfPath);
                document.close();
                System.out.println("✅ PDF Form Renamed Successfully for " + pdfFile.getName() + "!");
            } catch (IOException e) {
                System.out.println("❌ Error processing " + pdfFile.getName() + ": " + e.getMessage());
            }
        }
    }

    // Recursive function to rename all form fields (including child fields)
    private static void renameFields(Iterable<PDField> fields, Map<String, Integer> fieldCounters) throws IOException {
        for (PDField field : fields) {
            String originalName = field.getPartialName(); // Get the field name
            
            if (originalName == null || originalName.trim().isEmpty()) {
                continue; // Skip unnamed fields
            }

            // Fully clean field name (Remove Parent-Child Hierarchy & Indices)
            String cleanName = extractLastSegment(originalName);

            // Assign a new field name based on its type (textbox1, checkbox1, etc.)
            String fieldType = getFieldType(field);
            int count = fieldCounters.getOrDefault(fieldType, 0) + 1;
            String newName = fieldType + count;
            fieldCounters.put(fieldType, count);

            // Rename the field
            field.setPartialName(newName);
            System.out.println("✅ Renamed: " + originalName + " → " + newName);

            // Recursively rename child fields if they exist
            if (field instanceof PDNonTerminalField) {
                renameFields(((PDNonTerminalField) field).getChildren(), fieldCounters);
            }
        }
    }

    // Function to extract only the last segment of the field name (remove hierarchy)
    private static String extractLastSegment(String fullName) {
        // Remove everything before the last dot (.)
        if (fullName.contains(".")) {
            fullName = fullName.substring(fullName.lastIndexOf(".") + 1);
        }
        // Remove array indices like `[0]`
        return fullName.replaceAll("\\[\\d+\\]", "").trim();
    }

    // Function to determine field type for renaming
    private static String getFieldType(PDField field) {
        if (field instanceof PDTextField) {
            PDTextField textField = (PDTextField) field;
            String subType = textField.getFieldType();
            
            if ("Tx".equals(subType)) {
                // Check for specific characteristics to determine the type
                if (textField.getAlternateFieldName() != null && textField.getAlternateFieldName().toLowerCase().contains("date")) {
                    return "date";
                }
                if (textField.getAlternateFieldName() != null && textField.getAlternateFieldName().toLowerCase().contains("email")) {
                    return "email";
                }
                if (textField.getAlternateFieldName() != null && textField.getAlternateFieldName().toLowerCase().contains("currency")) {
                    return "currency";
                }
                if (textField.getAlternateFieldName() != null && textField.getAlternateFieldName().toLowerCase().contains("textarea")) {
                    return "textarea";
                }
                return "textbox";
            }
        }
        if (field instanceof PDCheckBox) return "checkbox";
        if (field instanceof PDRadioButton) return "radiobox";
        if (field instanceof PDComboBox || field instanceof PDListBox) return "dropdown";
        if (field instanceof PDSignatureField) return "signature";
        // Add logic for checkbox groups if needed
        return "field"; // Default fallback for unknown types
    }
}