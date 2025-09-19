import { createStore } from 'vuex'

// 模块
import dashboard from './modules/dashboard'
import dataSource from './modules/dataSource'
import workspace from './modules/workspace'

export default createStore({
  state: {
    // 全局主题设置
    theme: 'light',
    // 侧边栏折叠状态
    sidebarCollapsed: false,
    // 当前激活的标签页
    activeTab: 'dashboard',
    // 用户信息
    userInfo: {
      name: 'Admin',
      role: 'administrator'
    }
  },
  getters: {
    theme: state => state.theme,
    sidebarCollapsed: state => state.sidebarCollapsed,
    activeTab: state => state.activeTab,
    userInfo: state => state.userInfo
  },
  mutations: {
    SET_THEME(state, theme) {
      state.theme = theme
    },
    TOGGLE_SIDEBAR(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },
    SET_ACTIVE_TAB(state, tab) {
      state.activeTab = tab
    },
    SET_USER_INFO(state, userInfo) {
      state.userInfo = userInfo
    }
  },
  actions: {
    setTheme({ commit }, theme) {
      commit('SET_THEME', theme)
    },
    toggleSidebar({ commit }) {
      commit('TOGGLE_SIDEBAR')
    },
    setActiveTab({ commit }, tab) {
      commit('SET_ACTIVE_TAB', tab)
    },
    setUserInfo({ commit }, userInfo) {
      commit('SET_USER_INFO', userInfo)
    }
  },
  modules: {
    dashboard,
    dataSource,
    workspace
  }
})
