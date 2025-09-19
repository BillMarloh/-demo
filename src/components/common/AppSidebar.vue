<template>
  <div class="app-sidebar-wrapper">
    <!-- Logo区域 -->
    <div class="logo-section">
      <div class="logo">
        <el-icon class="logo-icon"><DataAnalysis /></el-icon>
        <span v-if="!sidebarCollapsed" class="logo-text">数据平台</span>
      </div>
    </div>
    
    <!-- 导航菜单 -->
    <el-menu
      :default-active="activeRoute"
      class="sidebar-menu"
      :collapse="sidebarCollapsed"
      :collapse-transition="false"
      router
    >
      <el-menu-item
        v-for="route in menuRoutes"
        :key="route.path"
        :index="route.path"
        class="menu-item"
      >
        <el-icon><component :is="getIconComponent(route.meta?.icon)" /></el-icon>
        <template #title>{{ route.meta?.title }}</template>
      </el-menu-item>
    </el-menu>
    
    <!-- 底部用户信息 -->
    <div class="user-section">
      <div class="user-info" :class="{ collapsed: sidebarCollapsed }">
        <el-avatar :size="32" :src="userAvatar" />
        <div v-if="!sidebarCollapsed" class="user-details">
          <div class="username">{{ userInfo.name }}</div>
          <div class="user-role">{{ userInfo.role }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import {
  DataAnalysis,
  Monitor,
  Database,
  DataBoard
} from '@element-plus/icons-vue'

export default {
  name: 'AppSidebar',
  components: {
    DataAnalysis,
    Monitor,
    Database,
    DataBoard
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    
    const sidebarCollapsed = computed(() => store.getters.sidebarCollapsed)
    const userInfo = computed(() => store.getters.userInfo)
    const activeRoute = computed(() => route.path)
    
    const userAvatar = computed(() => {
      return `https://api.dicebear.com/7.x/avataaars/svg?seed=${userInfo.value.name}`
    })
    
    const menuRoutes = [
      {
        path: '/dashboard',
        meta: { title: '数据仪表板', icon: 'Monitor' }
      },
      {
        path: '/datasource',
        meta: { title: '数据源管理', icon: 'Database' }
      },
      {
        path: '/workspace',
        meta: { title: '图表工作空间', icon: 'DataBoard' }
      }
    ]
    
    const getIconComponent = (iconName) => {
      const iconMap = {
        'Monitor': Monitor,
        'Database': Database,
        'DataBoard': DataBoard
      }
      return iconMap[iconName] || Monitor
    }
    
    return {
      sidebarCollapsed,
      userInfo,
      activeRoute,
      userAvatar,
      menuRoutes,
      getIconComponent
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.app-sidebar-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  
  .logo-section {
    padding: $spacing-lg;
    border-bottom: 1px solid $gray-200;
    
    .logo {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      
      .logo-icon {
        font-size: 24px;
        color: $primary-color;
      }
      
      .logo-text {
        font-size: $font-size-lg;
        font-weight: $font-weight-bold;
        color: $text-primary;
        white-space: nowrap;
      }
    }
  }
  
  .sidebar-menu {
    flex: 1;
    border-right: none;
    
    :deep(.el-menu-item) {
      height: 48px;
      line-height: 48px;
      margin: 4px $spacing-sm;
      border-radius: $border-radius-md;
      color: $text-secondary;
      
      &:hover {
        background-color: $bg-quaternary;
        color: $primary-color;
      }
      
      &.is-active {
        background-color: rgba($primary-color, 0.1);
        color: $primary-color;
        font-weight: $font-weight-medium;
        
        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 20px;
          background-color: $primary-color;
          border-radius: 0 2px 2px 0;
        }
      }
      
      .el-icon {
        font-size: 18px;
      }
    }
  }
  
  .user-section {
    padding: $spacing-md;
    border-top: 1px solid $gray-200;
    
    .user-info {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      padding: $spacing-sm;
      border-radius: $border-radius-md;
      cursor: pointer;
      transition: background-color $transition-fast;
      
      &:hover {
        background-color: $bg-quaternary;
      }
      
      &.collapsed {
        justify-content: center;
      }
      
      .user-details {
        flex: 1;
        min-width: 0;
        
        .username {
          font-size: $font-size-sm;
          font-weight: $font-weight-medium;
          color: $text-primary;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .user-role {
          font-size: $font-size-xs;
          color: $text-tertiary;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
}
</style>
