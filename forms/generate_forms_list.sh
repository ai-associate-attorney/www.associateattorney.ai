#!/bin/bash

# Create JSON structure
echo "{" > forms_list.json
echo "  \"jurisdictions\": {" >> forms_list.json

# Get all jurisdictions (first level directories)
first=true
for jurisdiction in */; do
    jurisdiction=${jurisdiction%/}
    
    if [ "$first" = true ]; then
        first=false
    else
        echo "    ," >> forms_list.json
    fi
    
    echo "    \"$jurisdiction\": {" >> forms_list.json
    echo "      \"areas\": {" >> forms_list.json
    
    # Get all areas of law for this jurisdiction
    area_first=true
    for area in "$jurisdiction"/*/; do
        area=${area%/}
        area=${area#*/}
        
        if [ "$area_first" = true ]; then
            area_first=false
        else
            echo "        ," >> forms_list.json
        fi
        
        echo "        \"$area\": {" >> forms_list.json
        echo "          \"forms\": [" >> forms_list.json
        
        # Get all forms in this area
        form_first=true
        for form in "$jurisdiction/$area"/*.html; do
            if [ -f "$form" ]; then
                form_name=$(basename "$form" .html)
                
                if [ "$form_first" = true ]; then
                    form_first=false
                else
                    echo "            ," >> forms_list.json
                fi
                
                echo "            {" >> forms_list.json
                echo "              \"id\": \"$form_name\"," >> forms_list.json
                echo "              \"name\": \"$(echo $form_name | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++)sub(/./,toupper(substr($i,1,1)),$i)}1')\"," >> forms_list.json
                echo "              \"path\": \"$jurisdiction/$area/$form_name.html\"" >> forms_list.json
                echo "            }" >> forms_list.json
            fi
        done
        
        echo "          ]" >> forms_list.json
        echo "        }" >> forms_list.json
    done
    
    echo "      }" >> forms_list.json
    echo "    }" >> forms_list.json
done

echo "  }" >> forms_list.json
echo "}" >> forms_list.json
