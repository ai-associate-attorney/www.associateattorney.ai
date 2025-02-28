<template>
  <el-header class="app-header">
    <div class="header-content">
      <div class="logo-section">
        <img src="@/assets/logo.svg" alt="AI Associate Attorney" class="logo" />
        <h1>AI Associate Attorney</h1>
      </div>
      
      <!-- Add matter selector when user is logged in -->
      <div v-if="user" class="matter-selector">
        <el-dropdown trigger="click" @command="handleMatterSelect">
          <span class="matter-dropdown-trigger">
            {{ selectedMatter ? getMatterName(selectedMatter) : 'No matter selected' }}
            <el-icon class="dropdown-icon"><caret-bottom /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item 
                v-for="matter in sharedMatters" 
                :key="matter.id"
                :command="matter.id"
              >
                {{ matter.title }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <div class="header-actions">
        <template v-if="user">
          <el-dropdown trigger="hover" placement="bottom-end">
            <div class="user-dropdown-trigger">
              <span class="user-name">{{ displayName }}</span>
              <el-avatar 
                :size="32" 
                :src="user.user_metadata?.avatar_url"
                :icon="UserFilled"
              />
              <el-icon class="dropdown-icon"><caret-bottom /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <span class="user-email">{{ user.email }}</span>
                </el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">
                  Logout
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        <template v-else>
          <el-button type="primary" plain>
            <el-icon><QuestionFilled /></el-icon>
            Help
          </el-button>
        </template>
      </div>
    </div>
  </el-header>
</template>

<script>
import { QuestionFilled, UserFilled, ArrowDown, CaretBottom } from '@element-plus/icons-vue'
import { supabase } from '@/supabase'

export default {
  name: 'AppHeader',
  components: {
    QuestionFilled,
    UserFilled,
    ArrowDown,
    CaretBottom
  },
  setup() {
    return {
      UserFilled,
      // ... rest of your setup logic
    }
  },
  data() {
    return {
      user: null,
      selectedMatter: null,
      sharedMatters: [],
    }
  },
  computed: {
    displayName() {
      if (!this.user) return '';
      return this.user.user_metadata?.name || 
             this.user.user_metadata?.user_name || 
             this.user.user_metadata?.full_name ||
             this.user.email;
    }
  },
  async mounted() {
    // Get initial session
    const { data: { session } } = await supabase.auth.getSession()
    this.user = session?.user || null

    // Listen for auth changes
    supabase.auth.onAuthStateChange((event, session) => {
      this.user = session?.user || null
    })

    // Fetch shared matters if user is logged in
    if (this.user) {
      await this.fetchSharedMatters()
      
      // Get matter_id from URL params and set selected matter
      const matterIdFromUrl = this.$route.query.matter_id
      if (matterIdFromUrl && this.sharedMatters.some(m => m.id === parseInt(matterIdFromUrl))) {
        this.selectedMatter = parseInt(matterIdFromUrl)
      }
    }
  },
  methods: {
    async handleLogout() {
      try {
        await supabase.auth.signOut()
      } catch (error) {
        console.error('Error logging out:', error)
      }
    },
    async fetchSharedMatters() {
      try {
        const { data: sharedMatters, error } = await supabase
          .from('matters')
          .select(`
            id,
            title,
            matter_access!inner (
              shared_with_user_id
            )
          `)
          .eq('archived', false)
          .eq('matter_access.shared_with_user_id', this.user.id)
          .order('created_at', { ascending: false });

        if (error) throw error
        this.sharedMatters = sharedMatters || []
      } catch (error) {
        console.error('Error fetching shared matters:', error)
      }
    },
    handleMatterSelect(matterId) {
      this.selectedMatter = matterId
      this.$router.push({
        query: { matter_id: matterId }
      })
    },
    getMatterName(matterId) {
      const matter = this.sharedMatters.find(m => m.id === matterId)
      return matter?.title || 'No matter selected'
    }
  },
  watch: {
    selectedMatter(newValue) {
      // Emit event for parent components to handle matter selection
      this.$emit('matter-changed', newValue)
    },
    '$route.query.matter_id': {
      immediate: true,
      handler(newMatterId) {
        if (newMatterId && this.sharedMatters.some(m => m.id === parseInt(newMatterId))) {
          this.selectedMatter = parseInt(newMatterId)
        }
      }
    },
    sharedMatters: {
      immediate: true,
      handler() {
        const matterIdFromUrl = this.$route.query.matter_id
        if (matterIdFromUrl && this.sharedMatters.some(m => m.id === parseInt(matterIdFromUrl))) {
          this.selectedMatter = parseInt(matterIdFromUrl)
        }
      }
    }
  }
}
</script>

<style scoped>
.app-header {
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  width: 100%;
  z-index: 100;
  padding: 0;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  gap: 20px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  height: 32px;
  width: 32px;
}

h1 {
  font-size: 1.4rem;
  font-weight: 400;
  color: #2c3e50;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.user-email {
  color: #606266;
  font-size: 0.9rem;
}

.user-dropdown-trigger {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  outline: none !important;
}

.dropdown-icon {
  color: #909399;
  transition: transform 0.2s;
}

.user-dropdown-trigger:hover .dropdown-icon {
  color: #606266;
}

.user-name {
  margin-right: 8px;
}

:deep(.el-dropdown-menu__item) {
  line-height: normal;
  padding: 8px 16px;
}

:deep(.el-avatar) {
  cursor: pointer;
}

:deep(.el-avatar:hover) {
  outline: none !important;
}

:deep(.el-avatar:focus) {
  outline: none !important;
}

.matter-selector {
  flex: 1;
  max-width: 400px;
  margin: 0 20px;
  text-align: center;
}

.matter-dropdown-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 12px;
  color: #606266;
}

.matter-dropdown-trigger:hover {
  color: #409eff;
}

.matter-dropdown-trigger .dropdown-icon {
  font-size: 12px;
}
</style> 