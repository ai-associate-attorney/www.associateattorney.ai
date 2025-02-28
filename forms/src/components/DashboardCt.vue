<template>
  <div class="dashboard-container">
    <AppHeader />
    
    <el-main class="main-content">
      <div class="search-section">
        <h2>Legal Forms</h2>
        <p class="subtitle">Find and fill out legal forms with AI assistance</p>
        
        <el-row :gutter="20" class="filters">
          <el-col :span="8">
            <el-input
              v-model="searchTerm"
              placeholder="Search forms..."
              clearable
              :prefix-icon="Search"
            />
          </el-col>
          <el-col :span="8">
            <el-select 
              v-model="selectedJurisdiction" 
              placeholder="Select Jurisdiction" 
              clearable
              class="w-full"
            >
              <el-option
                v-for="(_, jurisdiction) in formsList?.jurisdictions"
                :key="jurisdiction"
                :label="jurisdiction"
                :value="jurisdiction"
              />
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-select 
              v-model="selectedArea" 
              placeholder="Select Area"
              :disabled="!selectedJurisdiction"
              clearable
              class="w-full"
            >
              <el-option
                v-for="(_, area) in formsList?.jurisdictions[selectedJurisdiction]?.areas"
                :key="area"
                :label="area"
                :value="area"
              />
            </el-select>
          </el-col>
        </el-row>
      </div>

      <div class="forms-section">
        <div v-if="isLoading" class="loading-state">
          <el-skeleton :rows="6" animated />
          <el-skeleton :rows="6" animated />
          <el-skeleton :rows="6" animated />
        </div>

        <el-result
          v-else-if="error"
          icon="error"
          :title="error"
          sub-title="Please try again later"
        >
          <template #extra>
            <el-button type="primary" @click="retryLoadForms">Try Again</el-button>
          </template>
        </el-result>

        <el-empty 
          v-else-if="!displayedForms.length" 
          description="No forms found" 
        />

        <TransitionGroup
          v-else
          name="form-list"
          tag="div"
          class="forms-grid"
        >
          <el-card 
            v-for="form in displayedForms" 
            :key="form.id"
            class="form-card"
            :body-style="{ padding: '0px' }"
          >
            <div class="form-card-content">
              <div class="form-info">
                <h3>{{ form.title }}</h3>
                <el-tag type="success" size="small" style="margin-right: 5px;">{{ form.jurisdiction }}</el-tag>
                <el-tag type="warning" size="small">{{ form.area }}</el-tag>
              </div>
              <el-button 
                type="primary" 
                @click="navigateToForm(form.jurisdiction, form.area, form.id)"
                class="fill-button"
                :loading="loadingForm === form.id"
              >
                Fill Form
                <el-icon class="el-icon--right"><ArrowRight /></el-icon>
              </el-button>
            </div>
          </el-card>
        </TransitionGroup>
      </div>
    </el-main>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useFormsStore } from '@/store/forms';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { Search, ArrowRight } from '@element-plus/icons-vue';
import AppHeader from './layout/AppHeader.vue';

export default {
  name: 'DashboardCt',
  components: {
    AppHeader,
    Search, 
    ArrowRight
  },
  setup() {
    const router = useRouter();
    const formsStore = useFormsStore();
    const selectedJurisdiction = ref('');
    const selectedArea = ref('');
    const searchTerm = ref('');
    const isLoading = ref(true);
    const error = ref(null);
    const loadingForm = ref(null);

    const formsList = computed(() => formsStore.formsList);

    const allForms = computed(() => {
      if (!formsList.value?.jurisdictions) return [];
      
      const forms = [];
      Object.entries(formsList.value.jurisdictions).forEach(([jurisdiction, jurisdictionData]) => {
        Object.entries(jurisdictionData.areas).forEach(([area, areaData]) => {
          areaData.forms.forEach(form => {
            forms.push({
              ...form,
              jurisdiction,
              area
            });
          });
        });
      });
      return forms;
    });

    const displayedForms = computed(() => {
      let filtered = allForms.value;

      if (searchTerm.value) {
        const term = searchTerm.value.toLowerCase();
        filtered = filtered.filter(form => 
          form.name.toLowerCase().includes(term) ||
          form.id.toLowerCase().includes(term)
        );
      }

      if (selectedJurisdiction.value) {
        filtered = filtered.filter(form => form.jurisdiction === selectedJurisdiction.value);
      }

      if (selectedArea.value) {
        filtered = filtered.filter(form => form.area === selectedArea.value);
      }

      return filtered;
    });

    async function loadForms() {
      try {
        isLoading.value = true;
        error.value = null;
        await formsStore.loadFormsList();
      } catch (err) {
        error.value = 'Failed to load forms';
        console.error('Error loading forms:', err);
      } finally {
        isLoading.value = false;
      }
    }

    async function retryLoadForms() {
      await loadForms();
    }

    async function navigateToForm(jurisdiction, area, formId) {
      try {
        loadingForm.value = formId;
        await formsStore.loadFormMappings(jurisdiction, area, formId);
        router.push({
          path: `/${jurisdiction}/${formId}`,
          query: { ...router.currentRoute.value.query }
        });
      } catch (error) {
        ElMessage.error('Error loading form');
      } finally {
        loadingForm.value = null;
      }
    }

    // Load forms when component mounts
    loadForms();

    return {
      selectedJurisdiction,
      selectedArea,
      searchTerm,
      formsList,
      displayedForms,
      navigateToForm,
      isLoading,
      error,
      loadingForm,
      retryLoadForms,
      Search,
      ArrowRight
    };
  }
};
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.main-content {
  padding: 80px 20px 20px;
  height: calc(100vh - 80px); /* Adjust for header height */
  max-width: 1440px;
  margin: 0 auto;
}

.search-section {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.05);
  margin-bottom: 24px;
}

.search-section h2 {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  color: #2c3e50;
}

.subtitle {
  color: #606266;
  margin: 7px 0 0 0;
}

.filters {
  margin-top: 20px;
}

/* .forms-section {
  padding: 24px;
} */

.forms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.form-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateY(0);
}

.form-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 20px -10px rgba(0, 0, 0, 0.1);
}

.form-card-content {
  padding: 20px;
}

.form-info {
  margin-bottom: 16px;
}

.form-info h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #2c3e50;
}

.jurisdiction-tag {
  display: inline-block;
  padding: 4px 8px;
  background: #f0f2f5;
  border-radius: 4px;
  font-size: 12px;
  color: #606266;
}

.fill-button {
  width: 100%;
  transition: all 0.3s ease;
}

.fill-button.is-loading {
  background-color: var(--el-button-hover-bg-color);
}

.loading-state {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  padding: 24px;
}

.form-list-move,
.form-list-enter-active,
.form-list-leave-active {
  transition: all 0.5s ease;
}

.form-list-enter-from,
.form-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.form-list-leave-active {
  position: absolute;
}

.split-view {
  display: flex;
  gap: 20px;
  height: 100%;
  overflow: hidden;
}

.pdf-section {
  flex: 7;
  display: flex;
  flex-direction: column;
  min-height: 0; /* Important for Firefox */
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.pdf-container {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.pdf-viewer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}

.chat-section {
  flex: 3;
  min-width: 350px;
  max-width: 450px;
  display: flex;
  flex-direction: column;
  min-height: 0; /* Important for Firefox */
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  scrollbar-width: thin; /* For Firefox */
  scrollbar-color: rgba(0,0,0,0.2) transparent; /* For Firefox */
}

/* Custom scrollbar styling for WebKit browsers */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: transparent;
}

.chat-messages::-webkit-scrollbar-thumb {
  background-color: rgba(0,0,0,0.2);
  border-radius: 3px;
}
</style> 