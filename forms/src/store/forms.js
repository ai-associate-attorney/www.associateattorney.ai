import { defineStore } from 'pinia';

export const useFormsStore = defineStore('forms', {
  state: () => ({
    formsList: null,
    currentFormMappings: null,
    currentPdfPath: null,
    step1PromptTemplatePath: null,
    step2PromptTemplatePath: null
  }),

  actions: {
    findForm(jurisdiction, area, formId) {
      if (!this.formsList?.jurisdictions?.[jurisdiction]?.areas?.[area]?.forms) {
        return null;
      }
      return this.formsList.jurisdictions[jurisdiction].areas[area].forms
        .find(form => form.id.toLowerCase() === formId.toLowerCase());
    },

    async loadFormsList() {
      try {
        const response = await fetch('forms_list.json');
        this.formsList = await response.json();
      } catch (error) {
        console.error('Error loading forms list:', error);
        throw error;
      }
    },

    async loadFormMappings(jurisdiction, area, formId) {
      try {
        const form = this.findForm(jurisdiction, area, formId)
        if (!form) {
          throw new Error(`Form not found: ${formId}`)
        }

        const basePath = form.path.substring(0, form.path.lastIndexOf('/'))
        const mappingsPath = form.field_mappings_file 
          ? `${basePath}/${form.field_mappings_file}`
          : `${basePath}/field_mappings.json`

        const response = await fetch(`/forms/forms/${mappingsPath}`)
        if (!response.ok) {
          throw new Error(`Failed to load form mappings: ${response.statusText}`)
        }

        this.currentFormMappings = await response.json();
        this.currentPdfPath = `/forms/forms/${jurisdiction}/${area}/${formId}/Request-For-Order-fillable.pdf`;
        this.step1PromptTemplatePath = `/forms/forms/${jurisdiction}/${area}/${formId}/prompts/step1-ask-llm-for-most-efficient-message-to-give-to-the-user.txt`;
        this.step2PromptTemplatePath = `/forms/forms/${jurisdiction}/${area}/${formId}/prompts/step2-ask-llm-to-apply-user-input-to-the-current-state-to-arrive-at-new-state.txt`;
      } catch (error) {
        console.error('Error loading form mappings:', error);
        throw error;
      }
    }
  },

  persist: true
}); 