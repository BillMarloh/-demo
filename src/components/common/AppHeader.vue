<template>
  <div class="app-header-wrapper">
    <!-- 左侧控制区 -->
    <div class="header-left">
      <el-button
        type="text"
        class="sidebar-toggle"
        @click="toggleSidebar"
      >
        <el-icon><Expand v-if="sidebarCollapsed" /><Fold v-else /></el-icon>
      </el-button>
      
      <div class="breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item
            v-for="item in breadcrumbItems"
            :key="item.path"
            :to="item.path"
          >
            {{ item.title }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    
    <!-- 中间搜索区 -->
    <div class="header-center">
      <el-input
        v-model="searchQuery"
        placeholder="搜索图表、数据源..."
        class="search-input"
        clearable
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>
    
    <!-- 右侧操作区 -->
    <div class="header-right">
      <!-- 主题切换 -->
      <el-tooltip content="切换主题" placement="bottom">
        <el-button
          type="text"
          class="theme-toggle"
          @click="toggleTheme"
        >
          <el-icon><Sunny v-if="theme === 'light'" /><Moon v-else /></el-icon>
        </el-button>
      </el-tooltip>
      
      <!-- 通知 -->
      <el-tooltip content="通知" placement="bottom">
        <el-badge :value="notificationCount" :hidden="notificationCount === 0">
          <el-button type="text" class="notification-btn">
            <el-icon><Bell /></el-icon>
          </el-button>
        </el-badge>
      </el-tooltip>
      
      <!-- 设置 -->
      <el-tooltip content="设置" placement="bottom">
        <el-button type="text" class="settings-btn">
          <el-icon><Setting /></el-icon>
        </el-button>
      </el-tooltip>
      
      <!-- 全屏 -->
      <el-tooltip content="全屏" placement="bottom">
        <el-button
          type="text"
          class="fullscreen-btn"
          @click="toggleFullscreen"
        >
          <el-icon><FullScreen /></el-icon>
        </el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import {
  Expand,
  Fold,
  Search,
  Sunny,
  Moon,
  Bell,
  Setting,
  FullScreen
} from '@element-plus/icons-vue'

export default {
  name: 'AppHeader',
  components: {
    Expand,
    Fold,
    Search,
    Sunny,
    Moon,
    Bell,
    Setting,
    FullScreen
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    
    const searchQuery = ref('')
    const notificationCount = ref(3)
    
    const sidebarCollapsed = computed(() => store.getters.sidebarCollapsed)
    const theme = computed(() => store.getters.theme)
    
    const breadcrumbItems = computed(() => {
      const items = []
      
      items.push({ title: '首页', path: '/' })
      
      if (route.meta?.title) {
        items.push({ title: route.meta.title, path: route.path })
      }
      
      return items
    })
    
    const toggleSidebar = () => {
      store.dispatch('toggleSidebar')
    }
    
    const toggleTheme = () => {
      const newTheme = theme.value === 'light' ? 'dark' : 'light'
      store.dispatch('setTheme', newTheme)
    }
    
    const toggleFullscreen = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen()
      } else {
        document.exitFullscreen()
      }
    }
    
    return {
      searchQuery,
      notificationCount,
      sidebarCollapsed,
      theme,
      breadcrumbItems,
      toggleSidebar,
      toggleTheme,
      toggleFullscreen
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.app-header-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 $spacing-lg;
  
  .header-left {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    
    .sidebar-toggle {
      padding: $spacing-sm;
      
      .el-icon {
        font-size: 18px;
        color: $text-secondary;
      }
      
      &:hover .el-icon {
        color: $primary-color;
      }
    }
    
    .breadcrumb {
      :deep(.el-breadcrumb) {
        .el-breadcrumb__item {
          .el-breadcrumb__inner {
            color: $text-secondary;
            font-weight: $font-weight-normal;
            
            &:hover {
              color: $primary-color;
            }
          }
          
          &:last-child .el-breadcrumb__inner {
            color: $text-primary;
            font-weight: $font-weight-medium;
          }
        }
      }
    }
  }
  
  .header-center {
    flex: 1;
    max-width: 400px;
    margin: 0 $spacing-xl;
    
    .search-input {
      :deep(.el-input__wrapper) {
        border-radius: $border-radius-xl;
        background-color: $bg-quaternary;
        border: 1px solid transparent;
        
        &:hover {
          border-color: $primary-color;
        }
        
        &.is-focus {
          border-color: $primary-color;
          box-shadow: 0 0 0 2px rgba($primary-color, 0.1);
        }
        
        .el-input__inner {
          background: transparent;
        }
      }
    }
  }
  
  .header-right {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    
    .el-button {
      padding: $spacing-sm;
      
      .el-icon {
        font-size: 18px;
        color: $text-secondary;
      }
      
      &:hover .el-icon {
        color: $primary-color;
      }
    }
    
    .notification-btn,
    .settings-btn,
    .fullscreen-btn,
    .theme-toggle {
      width: 36px;
      height: 36px;
      border-radius: $border-radius-md;
      
      &:hover {
        background-color: $bg-quaternary;
      }
    }
  }
}
</style>
