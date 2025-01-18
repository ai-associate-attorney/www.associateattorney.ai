import os
import json

def generate_forms_list():
    forms_list = {
        "jurisdictions": {}
    }
    
    # Get all jurisdictions (first level directories)
    for jurisdiction in os.listdir('.'):
        if not os.path.isdir(jurisdiction) or jurisdiction.startswith('.'):
            continue
            
        forms_list["jurisdictions"][jurisdiction] = {
            "areas": {}
        }
        
        # Get all areas of law for this jurisdiction for e.g. California or New York
        jurisdiction_path = os.path.join(jurisdiction)
        for area in os.listdir(jurisdiction_path):
            area_path = os.path.join(jurisdiction_path, area)
            if not os.path.isdir(area_path) or area.startswith('.'):
                continue
                
            forms_list["jurisdictions"][jurisdiction]["areas"][area] = {
                "forms": []
            }
            
            # Get all form directories in this area for e.g. family-law
            for form_dir in os.listdir(area_path):
                form_dir_path = os.path.join(area_path, form_dir)
                if not os.path.isdir(form_dir_path) or form_dir.startswith('.'):
                    continue
                    
                # Look for *-fillable.pdf in the form directory here form_dir_path is california/family-law/fl-300
                # print(form_dir_path)
                for file in os.listdir(form_dir_path):
                    if file.endswith('- fillable.pdf'):
                        form_desc = file[:-12]  # Remove '-fillable.pdf'
                        form_data = {
                            "id": form_dir,
                            "name": form_desc,
                            "path": f"{jurisdiction}/{area}/{form_dir}/{file}"
                        }
                        forms_list["jurisdictions"][jurisdiction]["areas"][area]["forms"].append(form_data)
                        break  # Only take the first fillable PDF found
    
    # Write the JSON file with proper formatting
    with open('forms_list.json', 'w', encoding='utf-8') as f:
        json.dump(forms_list, f, indent=2, ensure_ascii=False)

if __name__ == '__main__':
    generate_forms_list() 