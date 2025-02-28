<template>
  <div class="form-fill-container">
    <!-- Header -->
    <AppHeader @matter-changed="handleMatterChange" />
    
    <!-- Main Content -->
    <el-main class="main-content">
      <!-- Initial View -->
      <div v-if="!showChat" class="initial-view">
        <div class="pdf-container">
          <embed 
            :src="pdfUrl" 
            type="application/pdf" 
            class="pdf-viewer"
            width="100%"
            height="100%"
          />
        </div>
        <el-button 
          type="primary" 
          size="large" 
          class="start-chat-btn"
          @click="startChat"
        >
          <el-icon class="el-icon--left"><ChatRound /></el-icon>
          Start chat to fill form
        </el-button>
      </div>

      <!-- Split View -->
      <div v-else class="split-view">
        <!-- PDF Section -->
        <div class="pdf-section">
          <div class="pdf-header">
            <h3 class="form-title section-title">{{ formId?.toUpperCase() }}</h3>
            <div class="pdf-actions">
              <el-button 
                v-if="hasFormData"
                type="danger" 
                plain 
                size="small" 
                @click="clearForm"
              >
                <el-icon class="el-icon--left"><Delete /></el-icon>
                Clear Form
              </el-button>
              <router-link :to="{ path: '/', query: $route.query }" class="back-link">
                <el-button type="primary" plain size="small">
                  <el-icon class="el-icon--left"><Back /></el-icon>
                  Back to Forms
                </el-button>
              </router-link>
            </div>
          </div>
          <div class="pdf-container">
            <embed 
              :src="pdfUrl" 
              type="application/pdf" 
              class="pdf-viewer"
              width="100%"
              height="100%"
            />
          </div>
        </div>

        <!-- Chat Section -->
        <div class="chat-section">
          <div class="chat-header">
            <h3 class="section-title">Legal Document Assistant</h3>
            <el-button 
              link
              @click="closeChat"
              class="close-chat"
            >
              <el-icon><Close /></el-icon>
            </el-button>
          </div>
          
          <div ref="chatMessages" class="chat-messages">
            <div v-for="(message, index) in messages" 
                 :key="index" 
                 class="message"
                 :class="message.sender === 'user' ? 'message-user' : 'message-ai'"
            >
              <div class="message-content">
                <p v-html="formatMessageText(message.text)"></p>
                <template v-if="message.sender === 'user'">
                  <el-icon 
                    class="reload-icon"
                    @click="resendMessage(message.text)"
                    :class="{ 'is-loading': isProcessing }"
                  >
                    <RefreshRight />
                  </el-icon>
                </template>
                <el-icon 
                  v-else-if="message.promptDetails" 
                  class="settings-icon"
                  @click="showPromptDetails(message.promptDetails)"
                >
                  <Setting />
                </el-icon>
              </div>
            </div>
            
            <!-- Add AI thinking indicator -->
            <div v-if="isProcessing" class="message message-ai thinking-message">
              <div class="message-content">
                <p>AI is thinking<span class="thinking-dots"><span>.</span><span>.</span><span>.</span></span></p>
              </div>
            </div>
          </div>

          <div class="chat-input">
            <el-input
              v-model="userInput"
              type="textarea"
              :rows="1"
              autosize
              placeholder="Type your message..."
              @keydown.enter.prevent="sendMessage"
            />
            <el-button 
              type="primary" 
              @click="sendMessage" 
              :loading="isProcessing"
            >
              Send
            </el-button>
          </div>
        </div>
      </div>

      <!-- Add Dialog for Prompt Details -->
      <el-dialog
        v-model="showPromptDialog"
        title="Prompt Details"
        width="70%"
        class="prompt-details-dialog"
      >
        <div class="prompt-sections">
          <div v-if="formattedPromptDetails?.step2?.system">
            <!-- Step 2 Section -->
            <h3 style="margin-top: 0;">Goal: Ask llm to apply user input to the current state to arrive at new state</h3>
            <div class="prompt-section">
              <div class="section-header" @click="toggleSection('step2_system')">
                <el-icon :class="{ 'is-expanded': expandedSections.step2_system }">
                  <ArrowRight />
                </el-icon>
                <h4>System Prompt</h4>
              </div>
              <div v-show="expandedSections.step2_system" class="section-content">
                <pre>{{ formattedPromptDetails?.step2?.system }}</pre>
              </div>
            </div>

            <div class="prompt-section">
              <div class="section-header" @click="toggleSection('step2_user')">
                <el-icon :class="{ 'is-expanded': expandedSections.step2_user }">
                  <ArrowRight />
                </el-icon>
                <h4>User Message</h4>
              </div>
              <div v-show="expandedSections.step2_user" class="section-content">
                <pre>{{ formattedPromptDetails?.step2?.user }}</pre>
              </div>
            </div>

            <div class="prompt-section">
              <div class="section-header" @click="toggleSection('step2_assistant')">
                <el-icon :class="{ 'is-expanded': expandedSections.step2_assistant }">
                  <ArrowRight />
                </el-icon>
                <h4>LLM Response</h4>
              </div>
              <div v-show="expandedSections.step2_assistant" class="section-content">
                <pre>{{ formattedPromptDetails?.step2?.assistant }}</pre>
              </div>
            </div>
          </div>

          <!-- Step 1 Section -->
          <h3 style="margin: 0;">Goal: Ask llm for most efficient message to give to the user</h3>
          <div class="prompt-section">
            <div class="section-header" @click="toggleSection('step1_system')">
              <el-icon :class="{ 'is-expanded': expandedSections.step1_system }">
                <ArrowRight />
              </el-icon>
              <h4>System Prompt</h4>
            </div>
            <div v-show="expandedSections.step1_system" class="section-content">
              <pre>{{ formattedPromptDetails?.step1?.system }}</pre>
            </div>
          </div>

          <div class="prompt-section">
            <div class="section-header" @click="toggleSection('step1_user')">
              <el-icon :class="{ 'is-expanded': expandedSections.step1_user }">
                <ArrowRight />
              </el-icon>
              <h4>User Message</h4>
            </div>
            <div v-show="expandedSections.step1_user" class="section-content">
              <pre>{{ formattedPromptDetails?.step1?.user }}</pre>
            </div>
          </div>

          <div class="prompt-section">
            <div class="section-header" @click="toggleSection('step1_assistant')">
              <el-icon :class="{ 'is-expanded': expandedSections.step1_assistant }">
                <ArrowRight />
              </el-icon>
              <h4>LLM Response</h4>
            </div>
            <div v-show="expandedSections.step1_assistant" class="section-content">
              <pre>{{ formattedPromptDetails?.step1?.assistant }}</pre>
            </div>
          </div>
        </div>
      </el-dialog>
    </el-main>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, nextTick, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFormsStore } from '@/store/forms';
import { ElMessage } from 'element-plus';
import { ChatRound, Download, Back, Close, Delete, Setting, ArrowRight, RefreshRight } from '@element-plus/icons-vue';
import AppHeader from './layout/AppHeader.vue';
import { PDFDocument, PDFName, PDFString, PDFCheckBox, PDFNumber } from 'pdf-lib';
import { supabase } from '../supabase';
import { applyPatch } from 'fast-json-patch';

export default {
  name: 'FormFill',
  components: {
    AppHeader,
    ChatRound,
    Download,
    Back,
    Close,
    Delete,
    Setting,
    ArrowRight,
    RefreshRight
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const formsStore = useFormsStore();
    const formId = ref(route.params.id);
    const messages = ref([]);
    const userInput = ref('');
    const isProcessing = ref(false);
    const currentView = ref('chat');
    const pdfDoc = ref(null);
    const pdfUrl = ref('');
    const chatMessages = ref(null);
    const viewer = ref(null);

    // Form state
    const fieldMappings = ref(new Map());
    const availableFields = ref(new Set());
    const filledFields = ref(new Map());
    const currentContext = ref({
      lastDiscussedField: null,
      suggestedNextField: null,
      recentFields: []
    });

    // Add PDF viewer state
    const currentPage = ref(1);
    const pageCount = ref(0);
    const isLoading = ref(true);

    // Add new ref for controlling chat visibility
    const showChat = ref(true);

    // Add computed property
    const hasFormData = computed(() => {
      return filledFields.value.size > 0 || messages.value.length > 1; // > 1 because of welcome message
    });

    // Add new ref for showing prompt details
    const showPromptDialog = ref(false);
    const currentPromptDetails = ref(null);

    const expandedSections = ref({
      step2_system: true,
      step2_user: true,
      step2_assistant: true,
      step1_system: true,
      step1_user: true,
      step1_assistant: true
    });

    const formattedPromptDetails = computed(() => {
      if (!currentPromptDetails.value) return null;
      const details = JSON.parse(currentPromptDetails.value);
      console.log('Details:', details);
      return {
        step2: {
          system: details.step2?.system,
          user: details.step2?.user,
          assistant: details.step2?.assistant,
          timestamp: details.step2?.timestamp
        },
        step1: {
          system: details.step1?.system,
          user: details.step1?.user,
          assistant: details.step1?.assistant,
          timestamp: details.step1?.timestamp
        }
      };
    });

    // Add this inside the setup() function, after the other refs
    const isAdmin = ref(false);

    const currentMatterId = ref(null);
    const currentFormMappingsJson = ref(null);

    const handleMatterChange = async (matterId) => {
      currentMatterId.value = matterId;
      
      if (matterId) {
        try {
          // Fetch custom fields for the matter
          const { data: customFields, error } = await supabase
            .from('matter_custom_fields')
            .select('*')
            .eq('matter_id', matterId);

          if (error) throw error;

          // If custom fields exist, make AI API call
          if (customFields && customFields.length > 0) {
            // Format custom fields for AI prompt
            const fieldsInfo = customFields.map(field => 
              `${field.field_label}: ${field.field_value}`
            ).join(",\n");

            // Set the user input and call sendMessage
            userInput.value = `Please fill out the form with the following information:\n${fieldsInfo}`;
            await sendMessage();
          }

          console.log('Matter changed:', matterId);
        } catch (error) {
          console.error('Error fetching custom fields:', error);
          ElMessage.error('Error loading matter custom fields');
        }
      }
    };

    async function loadFormData() {
      try {
        const { currentFormMappings, currentPdfPath } = formsStore;
        if (!currentFormMappings || !currentPdfPath) {
          ElMessage.error('Form data not found');
          router.push('/forms/');
          return;
        }

        console.log('Current pdf path:', currentPdfPath);
        // Load PDF bytes
        const response = await fetch(currentPdfPath);
        const pdfBytes = await response.arrayBuffer();

        try {
            pdfDoc.value = await PDFDocument.load(pdfBytes, {
              updateMetadata: false,
              ignoreEncryption: true,
              throwOnInvalidObject: false
            });
          console.log('PDF Doc:', pdfDoc.value);
            const root = pdfDoc.value.context.lookup(pdfDoc.value.context.trailerInfo.Root);
            if (!root) {
              console.warn('No root found in PDF');
              return;
            }

            // Get AcroForm reference and resolve it
            const acroFormRef = root.get(PDFName.of('AcroForm'));
            if (!acroFormRef) {
              console.warn('No AcroForm found in PDF');
              return;
            }

            // Resolve the AcroForm reference to get the actual dictionary
            const acroForm = pdfDoc.value.context.lookup(acroFormRef);
            console.log('AcroForm found:', acroForm);

            // Get Fields array reference
            const fieldsRef = acroForm.get(PDFName.of('Fields'));
            if (!fieldsRef) {
              console.warn('No Fields array found in AcroForm');
              return;
            }

            // Resolve the Fields array reference
            const fieldsArray = pdfDoc.value.context.lookup(fieldsRef);
            if (!fieldsArray || !Array.isArray(fieldsArray.array)) {
              console.warn('Fields array is empty or invalid');
              return;
            }
            console.log('Fields array found:', fieldsArray);

            const fields = [];
            function processField(fieldRef, parentPath = "") {
              const field = pdfDoc.value.context.lookup(fieldRef);
              if (!field) return;

              const fieldNameObj = field.get(PDFName.of("T")); // Field Name
              const fieldTypeObj = field.get(PDFName.of("FT")); // Field Type
              const kidsArray = field.get(PDFName.of("Kids")); // Child Fields

              let fieldName = fieldNameObj ? fieldNameObj.value : `UnnamedField_${fields.length}`;
              let fieldType = fieldTypeObj ? fieldTypeObj.toString() : "Unknown";

              // Construct hierarchical name
              let fullFieldName = parentPath ? `${fieldName}.${parentPath}` : fieldName;

              // Log extracted fields
              fields.push({
                 name: fieldName, 
                 type: fieldType,
                 dict: field,
                 fullName: fullFieldName
                });

              console.log(`Extracted Field: ${fullFieldName} | Type: ${fieldType}`);

              // Recursively process child fields (subforms)
              if (kidsArray && Array.isArray(kidsArray.array)) {
                kidsArray.array.forEach((childRef) => processField(childRef, fullFieldName));
              }
            }

            fieldsArray.array.forEach((fieldRef) => processField(fieldRef));

            /*const fields = [];
            for (let i = 0; i < fieldsArray.size(); i++) {
              const fieldRef = fieldsArray.get(i);
              const field = pdfDoc.value.context.lookup(fieldRef);
              
              if (field) {
                const nameRef = field.get(PDFName.of('T'));
                const typeRef = field.get(PDFName.of('FT'));
                
                const name = nameRef ? pdfDoc.value.context.lookup(nameRef).decodeText() : null;
                const type = typeRef ? pdfDoc.value.context.lookup(typeRef).toString() : 'Unknown';
                
                if (name) {
                  fields.push({
                    name,
                    type,
                    dict: field,
                    ref: fieldRef
                  });
                }
              }
            }*/

            console.log('Extracted fields:', fields);
            
            // Create mappings using the extracted fields
            const mappings = new Map();
            fields.forEach(field => {
              

            const fieldName = field.name;
            const fieldType = field.constructor.name;
            
            // Log all available information for debugging
            console.log('Processing field:', {
              name: fieldName,
              type: fieldType
            });
            
            // First, find the section containing the field
            let matchingField = null;
            for (const section of currentFormMappings.sections) {
              let found = section.fields.find(f => {
                const normalizedFieldName = fieldName;
                const normalizedMappingId = f.fieldId;
                return normalizedFieldName === normalizedMappingId;
              });

              // If not found, check within options array
              if (!found) {
                for (const field of section.fields) {
                  if (field.options) {
                    found = field.options.find(option => {
                      const normalizedFieldName = fieldName;
                      const normalizedOptionId = option.fieldId;
                      //console.log('Normalized field name:', normalizedFieldName);
                      //console.log('Normalized option id:', normalizedOptionId);
                      return normalizedFieldName === normalizedOptionId;
                    });
                    if (found) {
                      //console.log('Found field:', found);
                      matchingField = found;
                      break;
                    }
                  }
                  if (field.fields) {
                    found = field.fields.find(field => {
                      const normalizedFieldName = fieldName;
                      const normalizedFieldId = field.fieldId;
                      //console.log('Normalized field name:', normalizedFieldName);
                      //console.log('Normalized option id:', normalizedOptionId);
                      return normalizedFieldName === normalizedFieldId;
                    });
                    if (found) {
                      //console.log('Found field:', found);
                      matchingField = found;
                      break;
                    }
                  }
                }
              } else {
                matchingField = found;
                break;
              }
            }
            
            if (matchingField) {
              mappings.set(matchingField.fieldId, {
                pdfFieldName: fieldName,
                pdfFieldType: fieldType,
                fieldDict: field.dict,
                fieldRef: field.ref,
                humanReadableName: matchingField.label,
                required: matchingField.required,
                type: matchingField.type
              });
              console.log(`Mapped ${fieldName} to ${matchingField.fieldId}`);
            } else {
              console.warn(`No mapping found for PDF field: ${fieldName}`);
            }
            });
            console.log('Final mappings:', Array.from(mappings.entries()));
            fieldMappings.value = mappings;
            availableFields.value = new Set(mappings.keys());

          // Update viewer and load saved state
          await updatePdfViewer();
          await loadSavedState();

          } catch (error) {
            console.error('Error accessing PDF form fields:', error);
            throw error;
          }
      } catch (error) {
        console.error('Error loading form data:', error);
        ElMessage.error('Error loading form');
        router.push('/forms');
      }
    }

    async function loadSavedState() {
      try {
        // Load filled fields
        const savedFields = localStorage.getItem(`filledFields_${formId.value}`);
        if (savedFields) {
          filledFields.value = new Map(JSON.parse(savedFields));
          
          // Reapply all filled fields to the PDF
          for (const [fieldId, value] of filledFields.value) {
            try {
              await updateField(fieldId, value, true);
              availableFields.value.delete(fieldId);
            } catch (error) {
              console.warn(`Failed to restore field ${fieldId}:`, error);
            }
          }
        }

        // Load form mappings JSON
        const savedMappings = localStorage.getItem(`formMappings_${formId.value}`);
        if (savedMappings) {
          currentFormMappingsJson.value = savedMappings;
        } else {
          // Set initial value if none exists
          currentFormMappingsJson.value = JSON.stringify(formsStore.currentFormMappings, null, 2);
        }

        // Load chat history
        const savedChat = localStorage.getItem(`chatHistory_${formId.value}`);
        if (savedChat) {
          const savedMessages = JSON.parse(savedChat);
          messages.value = savedMessages;
        }

        // Load PDF state as fallback
        const savedPdf = localStorage.getItem(`pdfState_${formId.value}`);
        if (savedPdf && !savedFields) { // Only try loading saved PDF if we don't have field values
          try {
            const base64Clean = savedPdf.replace(/[^A-Za-z0-9+/=]/g, '');
            const bytes = new Uint8Array(
              atob(base64Clean)
                .split('')
                .map(c => c.charCodeAt(0))
            );

            const loadedPdf = await PDFDocument.load(bytes, {
              updateMetadata: false,
              ignoreEncryption: true,
              throwOnInvalidObject: false
            });

            const form = loadedPdf.getForm();
            if (form.getFields().length > 0) {
              pdfDoc.value = loadedPdf;
            }
          } catch (e) {
            console.warn('Error loading saved PDF state:', e);
          }
        }
        // Update the viewer once after all fields are updated
        await updatePdfViewer();

      } catch (error) {
        console.error('Error loading saved state:', error);
      }
    }

    async function saveState() {
      try {
        // Convert Map to array before stringifying
        const fieldsArray = Array.from(filledFields.value.entries());
        localStorage.setItem(
          `filledFields_${formId.value}`, 
          JSON.stringify(fieldsArray)
        );

        localStorage.setItem(
          `chatHistory_${formId.value}`, 
          JSON.stringify(messages.value)
        );

        if (pdfDoc.value) {
          const pdfBytes = await pdfDoc.value.save();
          // Convert to base64 in chunks to avoid call stack issues
          const uint8Array = new Uint8Array(pdfBytes);
          const chunkSize = 8192;
          let base64 = '';
          
          for (let i = 0; i < uint8Array.length; i += chunkSize) {
            const chunk = uint8Array.slice(i, i + chunkSize);
            base64 += btoa(String.fromCharCode.apply(null, chunk));
          }
          
          localStorage.setItem(`pdfState_${formId.value}`, base64);
        }
      } catch (error) {
        console.error('Error saving state:', error);
      }
    }

    async function updatePdfViewer() {
      try {
        if (!pdfDoc.value) return;

        // Use currentFormMappingsJson instead of validatedJsonContent
        if (!currentFormMappingsJson.value) {
          console.warn('No JSON content available. Loading PDF without updates.');
          await loadPdfWithoutUpdates();
          return;
        }

        // Clean the JSON string by removing markdown code block delimiters
        const cleanedJsonString = currentFormMappingsJson.value
          .replace(/```(?:json)?\s*([\s\S]*?)\s*```/, '$1') // Remove markdown code block
          .replace(/^\s*\/\/.*$/gm, '') // Remove any single-line comments
          .trim();

        // Log the cleaned JSON string for debugging
        console.log('Cleaned JSON string:', cleanedJsonString);

        // Attempt to parse the cleaned JSON string
        let fieldUpdates;
        try {
          fieldUpdates = JSON.parse(cleanedJsonString);
        } catch (parseError) {
          console.error('Error parsing JSON:', parseError);
          throw new Error('Invalid JSON format. Please check the JSON structure.');
        }

        console.log('Field Mappings:', fieldMappings.value);
        // Iterate over the sections and fields to apply updates
        for (const section of fieldUpdates.sections) {
          for (const field of section.fields) {
            if (field.type === 'checkbox_group') {
              // Iterate over options for checkbox groups
              for (const option of field.options) {
                const { fieldId, label } = option;
                //if (fieldId.endsWith('ChkBx')) {
                  //console.log('Checking for checkbox fieldId:', fieldId);
                  const value = option.selected || false; // Assuming value is stored in option
                  if (fieldMappings.value.has(fieldId)) {
                    //console.log('Checkbox option selected:', option);
                    console.log('Updating checkbox field:', fieldId, 'with value:', value);
                    await updateField(fieldId, value, true); // true to skip refresh for each field
                  } else {
                    console.warn(`No mapping found for checkbox fieldId: ${fieldId}`);
                  }
                //}
              }
            } else {
              // Handle other field types
              console.log('Processing field now:', field);
              const { fieldId, value } = field;
              if (fieldMappings.value.has(fieldId)) {
                console.log('Updating field:', fieldId, 'with value:', value);
                await updateField(fieldId, value, true); // true to skip refresh for each field
              } else {
                console.warn(`No mapping found for fieldId: ${fieldId}`);
              }
            }
          }
        }

        await saveAndDisplayPdf();
      } catch (error) {
        console.error('Error updating PDF viewer:', error);
        throw error;
      }
    }

    async function loadPdfWithoutUpdates() {
      try {
        await saveAndDisplayPdf();
      } catch (error) {
        console.error('Error loading PDF without updates:', error);
      }
    }

    async function saveAndDisplayPdf() {
      const pdfBytes = await pdfDoc.value.save({
        useObjectStreams: false,
      });

      if (pdfUrl.value) {
        URL.revokeObjectURL(pdfUrl.value);
      }

      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      pdfUrl.value = URL.createObjectURL(blob);

      console.log('PDF loaded successfully:', pdfUrl.value);
    }

    async function downloadPDF() {
      try {
        const pdfBytes = await pdfDoc.value.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${formId.value}-filled.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error downloading PDF:', error);
        ElMessage.error('Error downloading PDF');
      }
    }

    function addMessage(text, sender, promptDetails = null) {
      messages.value.push({ text, sender, promptDetails });
      setTimeout(() => {
        if (chatMessages.value) {
          chatMessages.value.scrollTop = chatMessages.value.scrollHeight;
        }
      }, 100);
    }

    // Add this helper function to extract JSON from a string that may contain markdown
    function extractJsonFromResponse(response) {
      try {
        // First try direct parse in case it's already clean JSON
        return JSON.parse(response);
      } catch (e) {
        // If direct parse fails, try to extract JSON from markdown
        try {
          // Look for JSON between code blocks
          const jsonMatch = response.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
          if (jsonMatch && jsonMatch[1]) {
            return JSON.parse(jsonMatch[1]);
          }
          
          // If no code blocks, try to find first { to last }
          const jsonContent = response.match(/\{[\s\S]*\}/);
          if (jsonContent) {
            return JSON.parse(jsonContent[0]);
          }
          
          // If all else fails, return the original response wrapped in an object
          return {
            messageToShowUser: response
          };
        } catch (err) {
          console.warn('Failed to extract JSON from response:', err);
          return {
            messageToShowUser: response
          };
        }
      }
    }

    function validateAndExtractFormJson(response) {
      try {
        // First try checking if response is valid JSON
        JSON.parse(response);
        return true;

        // If direct parse fails, look for JSON in markdown code blocks
      } catch (error) {
        try {
          // Look for JSON between code blocks
          const jsonMatch = response.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
          if (jsonMatch) {
            return true;
          }

          // Try finding JSON between first { and last }
          const jsonContent = response.match(/(\{[\s\S]*\})/);
          if (jsonContent) {
            return true;
          }

          return false;

        } catch (error) {
          return false;
        }
      }
    }

    async function sendMessage() {
      if (!userInput.value.trim()) return;
      
      const message = userInput.value;
      userInput.value = '';
      addMessage(message, 'user');
      
      isProcessing.value = true;
      try {
        let isJsonPatchAvailable = true;
        // Step 1: First API call to get JSON Patch
        const systemMessage = await generateSystemMessage('step2');
        const step2Response = await fetch('https://forms-vue-app.vercel.app/api/openai-direct', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [
              { role: "system", content: systemMessage },
              { role: "user", content: 'The user has typed the following information in the chatbox:\n'+message }
            ]
          })
        });

        const updateResponse = await step2Response.json();
        console.log('Update response:', updateResponse);

        // Step 2: Apply JSON Patch
        try {
          const jsonPatchContent = updateResponse.choices[0].message.content;
          let jsonPatch = null;
          // Use regex to extract JSON from markdown code block
          const jsonMatch = jsonPatchContent.match(/```json\s*([\s\S]*?)\s*```/);
          if (!jsonMatch || !jsonMatch[1]) {
            isJsonPatchAvailable = false;
            //throw new Error('No JSON content found in the response');
            console.log('No JSON content found in the response');
          }
          else {
            if(jsonPatchContent.match('/\[.*\]/')) {
              jsonPatch = JSON.parse(jsonPatchContent);
            }
            else {
              jsonPatch = JSON.parse(jsonMatch[1]);
            }
            
            console.log('JSON content found in the response');
          }

          const currentJson = JSON.parse(currentFormMappingsJson.value);

          // Log currentJson for debugging
          console.log('Current JSON before patch:', currentJson);

          // Validate paths in JSON Patch
          jsonPatch.forEach(patch => {
            const pathParts = patch.path.split('/').slice(1); // Remove the leading empty string
            let current = currentJson;
            for (const part of pathParts) {
              if (!(part in current)) {
                //throw new Error(`Invalid path in JSON Patch: ${patch.path}`);
                console.log('Invalid path in JSON Patch:', patch.path);
              }
              else {
                current = current[part];
              }
            }
          });

          const updatedJson = applyPatch(currentJson, jsonPatch).newDocument;
          currentFormMappingsJson.value = JSON.stringify(updatedJson, null, 2);
          localStorage.setItem(`formMappings_${formId.value}`, currentFormMappingsJson.value);

          // Update previousJson for diff calculation
         // previousJson.value = updatedJson;
        } catch (error) {
          console.log('Error parsing JSON Patch:', error);
          //ElMessage.error('Invalid JSON Patch format received');
        }

        // Save first API call prompt details
        const step2PromptDetails = {
          system: systemMessage,
          user: 'The user has typed the following information in the chatbox:\n' + message,
          assistant: updateResponse.choices[0].message.content,
          timestamp: new Date().toISOString()
        };

        // Step 3: Second API call to get next question
        const updatedSystemMessage = await generateSystemMessage('step1');
        const step1Response = await fetch('https://forms-vue-app.vercel.app/api/openai-direct', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [
              { role: "system", content: updatedSystemMessage },
              { role: "user", content: "What should I ask the user next?" }
            ]
          })
        });

        const nextQuestionResponse = await step1Response.json();
        console.log('Next question response:', nextQuestionResponse);

        // Step 4: Present the next question to the user
        const responseJson = extractJsonFromResponse(nextQuestionResponse.choices[0].message.content);
        const messageToShow = responseJson.messageToShowUser || nextQuestionResponse.choices[0].message.content;
        addMessage(messageToShow, 'ai', JSON.stringify({
          step2: step2PromptDetails,
          step1: {
            system: updatedSystemMessage,
            user: "What should I ask the user next?",
            assistant: nextQuestionResponse.choices[0].message.content,
            timestamp: new Date().toISOString()
          }
        }));

        // Step 5: Save the current state
        await saveState();

        // Step 6: Update the PDF viewer
        if (isJsonPatchAvailable) { 
          console.log('Updating PDF viewer as  json patch available');
          await updatePdfViewer();
        }

      } catch (error) {
        console.error('Error processing message:', error);
        ElMessage.error('Error processing message');
      } finally {
        isProcessing.value = false;
      }
    }

    function toggleView(view) {
      currentView.value = view;
      const pdfSection = document.getElementById('pdfSection');
      const chatSection = document.getElementById('chatSection');
      
      if (view === 'pdf') {
        pdfSection.classList.remove('hidden');
        chatSection.classList.add('hidden');
      } else {
        chatSection.classList.remove('hidden');
        pdfSection.classList.add('hidden');
      }
    }

    function pageLoaded() {
      isLoading.value = false;
    }

    function pdfLoaded() {
      console.log('PDF loaded successfully');
    }

    async function updateField(fieldId, value, skipRefresh = false) {
      if (!pdfDoc.value) {
        console.error('No PDF document loaded');
        return;
      }

      try {
        // Debug logging
        console.log('Current fieldMappings:', {
          size: fieldMappings.value.size,
          keys: Array.from(fieldMappings.value.keys())
        });
        console.log('fieldId:', fieldId);
        console.log('value:', value);

        // Iterate over all mappings to find all occurrences of the fieldId
        const fieldsToUpdate = [];
        fieldMappings.value.forEach((mapping, key) => {
          if (key === fieldId) {
            fieldsToUpdate.push(mapping);
          }
        });

        if (fieldsToUpdate.length === 0) {
          console.error(`No field mapping found for "${fieldId}". Available mappings:`, 
            Array.from(fieldMappings.value.keys()));
          return;
        }

        for (const mapping of fieldsToUpdate) {
          if (!mapping.fieldDict) {
            console.error(`Field mapping found for "${fieldId}" but no fieldDict available`);
            continue;
          }

          const fieldDict = mapping.fieldDict;
          const fieldType = fieldDict.get(PDFName.of('FT'));
          console.log('Field type:', fieldType?.toString());

          try {
            if (fieldType?.toString() === '/Btn') {
              // Checkbox or Radio button
              const flags = fieldDict.get(PDFName.of('Ff'))?.value || 0;
              const isCheckbox = (flags & 32768) === 0;

              if (isCheckbox) {
                const shouldCheck = typeof value === 'boolean' ? value : 
                  ['yes', 'true', 'checked', '1', 'on'].includes(String(value).toLowerCase());

                // Set the value
                fieldDict.set(PDFName.of('V'), shouldCheck ? PDFName.of('Yes') : PDFName.of('Off'));
                fieldDict.set(PDFName.of('AS'), shouldCheck ? PDFName.of('Yes') : PDFName.of('Off'));

                // Remove existing appearance streams to force regeneration
                if (fieldDict.has(PDFName.of('AP'))) {
                  fieldDict.delete(PDFName.of('AP'));
                }

                fieldDict.set(PDFName.of('F'), PDFNumber.of(4));
              } else {
                // Radio button
                const radioValue = PDFName.of(value.toString());
                fieldDict.set(PDFName.of('V'), radioValue);
                fieldDict.set(PDFName.of('AS'), radioValue);
              }
            } else {
              // Text fields and other types
              const stringValue = PDFString.of(value.toString());
              fieldDict.set(PDFName.of('V'), stringValue);
              fieldDict.set(PDFName.of('DV'), stringValue);

              if (!fieldDict.has(PDFName.of('DA'))) {
                fieldDict.set(PDFName.of('DA'), PDFString.of('/Helv 0 Tf 0 g'));
              }

              if (fieldDict.has(PDFName.of('AP'))) {
                fieldDict.delete(PDFName.of('AP'));
              }
            }

            // Get the AcroForm dictionary and set NeedAppearances only once
            const root = pdfDoc.value.context.lookup(pdfDoc.value.context.trailerInfo.Root);
            const acroFormRef = root.get(PDFName.of('AcroForm'));
            if (acroFormRef) {
              const acroForm = pdfDoc.value.context.lookup(acroFormRef);
              acroForm.set(PDFName.of('NeedAppearances'), PDFNumber.of(1));
            }

            console.log(`Successfully updated field "${fieldId}" with value:`, value);
          } catch (error) {
            console.error(`Error setting value for field "${fieldId}":`, error);
            throw error;
          }
        }

        // Only update viewer if not skipping refresh
        if (!skipRefresh) {
          await updatePdfViewer();
        }
      } catch (error) {
        console.error(`Error updating field "${fieldId}":`, error);
        throw error;
      }
    }

    async function generateSystemMessage(step) {
      try {
        // Get the prompt template path from the store
        const { step1PromptTemplatePath, step2PromptTemplatePath } = formsStore;
        if (!step1PromptTemplatePath || !step2PromptTemplatePath) {
          throw new Error('Prompt template path not found in store');
        }

        // Fetch the appropriate prompt template based on the step
        const promptTemplatePath = step === 'step1' ? step1PromptTemplatePath : step2PromptTemplatePath;
        const response = await fetch(promptTemplatePath);
        if (!response.ok) {
          throw new Error('Failed to load prompt template');
        }
        let promptTemplate = await response.text();

        // Get the current form mappings JSON
        const formMappingsJson = currentFormMappingsJson.value;

        // If this is step1, include conversation history
        if (step === 'step1') {
          // Format conversation history if it exists
          let conversationHistory = "No previous conversation history.";
          if (messages.value && messages.value.length > 0) {
            conversationHistory = messages.value
              .map(msg => `${msg.sender.toUpperCase()}: ${msg.text}`)
              .join('\n\n');
          }

          promptTemplate = promptTemplate
            .replace('[ComprehensiveJSONDescription]', formMappingsJson)
            .replace('[ConversationHistory]', conversationHistory);
        } else {
          // For step2, include the JSON state and the last AI message
          const lastAiMessage = messages.value
            .filter(msg => msg.sender === 'ai')
            .pop()?.text || '';

          promptTemplate = promptTemplate
            .replace('[ComprehensiveJSONDescription]', formMappingsJson)
            .replace('[PromptGivenToUser]', lastAiMessage);
        }

        return promptTemplate;
      } catch (error) {
        console.error('Error generating system message:', error);
        // Fallback to a basic prompt if there's an error
        return 'You are a helpful assistant designed to help users fill out legal forms. Please help the user complete the form fields.';
      }
    }

    // Add beforeunload event listener
    onMounted(async () => {
      await loadFormData();
      await checkAdminStatus();
      window.addEventListener('beforeunload', () => saveState());
      
      if (messages.value.length === 0) {
        await loadInitialPrompt();
      }
    });

    onBeforeUnmount(() => {
      window.removeEventListener('beforeunload', saveState);
      if (pdfUrl.value) {
        URL.revokeObjectURL(pdfUrl.value);
      }
      if (viewer.value) {
        viewer.value.dispose();
      }
    });

    // Add function to start chat
    async function startChat() {
      showChat.value = true;
      await nextTick();
    }

    async function closeChat() {
      showChat.value = false;
      await nextTick();
    }

    async function clearForm() {
      try {
        // Clear local storage
        localStorage.removeItem(`filledFields_${formId.value}`);
        localStorage.removeItem(`chatHistory_${formId.value}`);
        localStorage.removeItem(`pdfState_${formId.value}`);
        localStorage.removeItem(`formMappings_${formId.value}`);

        // Clear reactive state
        messages.value = [];
        filledFields.value = new Map();
        availableFields.value = new Set(fieldMappings.value.keys());
        currentFormMappingsJson.value = JSON.stringify(formsStore.currentFormMappings, null, 2);

        // Reset PDF to original state
        await loadFormData();

        // Add welcome message back
        //addMessage("Hi! I'm here to help you fill out this form. Please tell me what information you'd like to provide, and I'll guide you through the process.", 'ai');

        ElMessage.success('Form cleared successfully');
      } catch (error) {
        console.error('Error clearing form:', error);
        ElMessage.error('Error clearing form');
      }
    }

    function showPromptDetails(promptDetails) {
      currentPromptDetails.value = promptDetails;
      showPromptDialog.value = true;
    }

    function toggleSection(section) {
      expandedSections.value[section] = !expandedSections.value[section];
    }

    // Add this after loadFormData() is called in onMounted
    async function checkAdminStatus() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: admins, error } = await supabase
            .from('system_admins')
            .select('*')
            .eq('user_id', session.user.id)
            .single();
          
          if (error) throw error;
          isAdmin.value = !!admins;
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        isAdmin.value = false;
      }
    }

    async function loadInitialPrompt() {
      isProcessing.value = true;
      try {
        currentFormMappingsJson.value = JSON.stringify(formsStore.currentFormMappings, null, 2);
        const systemMessage = await generateSystemMessage('step1');
        const response = await fetch('https://forms-vue-app.vercel.app/api/openai-direct', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [
              { role: "system", content: systemMessage },
              { role: "user", content: "What should I ask the user first?" }
            ]
          })
        });

        const aiResponse = await response.json();
        
        // Create combined prompt details with both steps
        const combinedPromptDetails = JSON.stringify({
          step2: null, // No step2 for initial prompt
          step1: {
            system: systemMessage,
            user: "What should I ask the user first?",
            assistant: aiResponse.choices[0].message.content,
            timestamp: new Date().toISOString()
          }
        });

        // Parse the JSON response
        const responseJson = extractJsonFromResponse(aiResponse.choices[0].message.content);
        const messageToShow = responseJson.messageToShowUser || aiResponse.choices[0].message.content;

        addMessage(messageToShow, 'ai', combinedPromptDetails);
      } catch (error) {
        console.error('Error loading initial prompt:', error);
        ElMessage.error('Error starting the conversation');
      } finally {
        isProcessing.value = false;
      }
    }

    function formatMessageText(text) {
      if (!text) return '';
      return text
        // Convert markdown-style bold to HTML
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // Convert single asterisks to italics
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        // Convert newlines to <br> tags
        .replace(/\n/g, '<br>')
        // Convert underscores to underline
        .replace(/__(.*?)__/g, '<u>$1</u>')
        // Convert bullet points
        .replace(/^\s*[-•]\s/gm, '&bull; ');
    }

    const resendMessage = async (text) => {
      if (isProcessing.value) return;
      userInput.value = text;
      await sendMessage();
    };

    return {
      formId,
      messages,
      userInput,
      isProcessing,
      currentView,
      pdfUrl,
      sendMessage,
      toggleView,
      downloadPDF,
      currentPage,
      pageCount,
      pageLoaded,
      pdfLoaded,
      showChat,
      startChat,
      closeChat,
      clearForm,
      hasFormData,
      showPromptDialog,
      formattedPromptDetails,
      showPromptDetails,
      expandedSections,
      toggleSection,
      isAdmin,
      handleMatterChange,
      currentMatterId,
      loadInitialPrompt,
      formatMessageText,
      resendMessage,
    };
  }
};
</script>

<style scoped>
.form-fill-container {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.main-content {
  padding: 80px 0 20px;
  max-width: 1400px;
  margin: 0 auto;
  height: 100vh;
}

.initial-view {
  height: 100%;
  position: relative;
}

.pdf-container {
  height: 100%;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.start-chat-btn {
  position: fixed;
  bottom: 40px;
  right: 40px;
  font-size: 1.1rem;
  padding: 12px 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.split-view {
  display: flex;
  gap: 20px;
  height: 100%;
}

.pdf-section {
  flex: 7;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-section {
  flex: 3;
  min-width: 350px;
  max-width: 450px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
}

.pdf-header, .chat-header {
  padding: 10px 15px;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pdf-container {
  flex: 1;
  position: relative;
  height: calc(100% - 50px);
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  overflow: hidden;
}

.pdf-viewer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
  overflow: hidden; /* Ensure no overflow hides the text */
}

.close-chat {
    height: auto;
    padding: 0;
}

h3.section-title {
    margin: 0;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.chat-input {
  border-top: 1px solid #e4e7ed;
  padding: 16px;
  display: flex;
  gap: 8px;
}

.message {
  margin-bottom: 5px;
  max-width: 85%;
  padding: 10px;
  border-radius: 8px;
}

.message-user {
  margin-left: auto;
  background-color: var(--el-color-primary);
  color: white;
}

.message-ai {
  margin-right: auto;
  background-color: #f4f4f5;
  color: #606266;
}

.message-content {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.settings-icon {
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s;
  font-size: 16px;
  margin-top: 4px;
}

.settings-icon:hover {
  opacity: 1;
}

.message-user .settings-icon {
  color: white;
}

.message-ai .settings-icon {
  color: #606266;
}

.prompt-details-dialog {
  /* Add any necessary styles for the dialog */
}

.prompt-sections {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.prompt-section {
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background-color: #f5f7fa;
  cursor: pointer;
  user-select: none;
}

.section-header h4 {
  margin: 0;
  font-size: 14px;
  color: #606266;
}

.section-content {
  padding: 12px;
  background: white;
  border-top: 1px solid #e4e7ed;
}

.section-content pre {
  margin: 0;
  white-space: pre-wrap;
  font-family: monospace;
  font-size: 13px;
  color: #606266;
}

.el-icon {
  transition: transform 0.3s;
}

.is-expanded {
  transform: rotate(90deg);
}

.message p {
  margin: 0;
}

.message-content p {
  margin: 0;
  line-height: 1.5;
}

.message-content p strong {
  font-weight: 600;
}

.message-content p br {
  margin-bottom: 8px;
}

@media (max-width: 768px) {
  .split-view {
    flex-direction: column;
  }

  .chat-section {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    max-width: none;
    height: 50vh;
    border-radius: 16px 16px 0 0;
  }

  .pdf-section {
    height: 50vh;
  }
}

.thinking-message {
  opacity: 0.7;
}

.thinking-dots {
  display: inline-block;
}

.thinking-dots span {
  animation: thinking 1.4s infinite;
  display: inline-block;
}

.thinking-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.thinking-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes thinking {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-4px);
    opacity: 1;
  }
}

.reload-icon {
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s;
  font-size: 16px;
  margin-top: 4px;
  color: white;
  position: absolute;
  right: 4px; 
  top: 0;
  z-index: 1000;
}

.reload-icon:hover {
  opacity: 1;
}

.reload-icon.is-loading {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.text-field {
  color: #000; /* Ensure text color is visible */
  background-color: transparent; /* Ensure background does not obscure text */
  font-size: 12px; /* Adjust font size as needed */
}
</style> 