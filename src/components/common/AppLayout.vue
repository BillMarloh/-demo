<template>
  <el-container class="app-layout">
    <!-- 侧边栏 -->
    <el-aside :width="sidebarWidth" class="app-sidebar">
      <AppSidebar />
    </el-aside>
    
    <!-- 主内容区 -->
    <el-container class="main-container">
      <!-- 顶部导航 -->
      <el-header class="app-header">
        <AppHeader />
      </el-header>
      
      <!-- 内容区域 -->
      <el-main class="app-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'

export default {
  name: 'AppLayout',
  components: {
    AppSidebar,
    AppHeader
  },
  setup() {
    const store = useStore()
    
    const sidebarCollapsed = computed(() => store.getters.sidebarCollapsed)
    
    const sidebarWidth = computed(() => {
      return sidebarCollapsed.value ? '64px' : '240px'
    })
    
    return {
      sidebarWidth
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.app-layout {
  height: 100vh;
  
  .app-sidebar {
    background: $white;
    border-right: 1px solid $gray-200;
    transition: width $transition-normal;
    overflow: hidden;
  }
  
  .main-container {
    .app-header {
      background: $white;
      border-bottom: 1px solid $gray-200;
      padding: 0;
      height: $header-height;
      display: flex;
      align-items: center;
    }
    
    .app-main {
      background: $bg-secondary;
      padding: $spacing-lg;
      overflow-y: auto;
    }
  }
}
</style>
