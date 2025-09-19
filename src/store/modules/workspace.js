export default {
  namespaced: true,
  state: {
    // 工作空间标签页
    tabs: [
      {
        id: 'tab1',
        name: '销售分析工作台',
        type: 'dashboard',
        active: true,
        saved: true,
        charts: []
      }
    ],
    activeTabId: 'tab1',
    // 图表配置面板
    chartConfigVisible: false,
    currentEditingChart: null,
    // 可用图表类型
    availableChartTypes: [
      { type: 'line', name: '折线图', icon: 'el-icon-data-line' },
      { type: 'bar', name: '柱状图', icon: 'el-icon-data-board' },
      { type: 'pie', name: '饼图', icon: 'el-icon-pie-chart' },
      { type: 'scatter', name: '散点图', icon: 'el-icon-data-analysis' },
      { type: 'funnel', name: '漏斗图', icon: 'el-icon-funnel-chart' },
      { type: 'gauge', name: '仪表盘', icon: 'el-icon-odometer' },
      { type: 'radar', name: '雷达图', icon: 'el-icon-compass' },
      { type: 'heatmap', name: '热力图', icon: 'el-icon-map-location' }
    ]
  },
  getters: {
    tabs: state => state.tabs,
    activeTab: state => state.tabs.find(tab => tab.id === state.activeTabId),
    activeTabId: state => state.activeTabId,
    chartConfigVisible: state => state.chartConfigVisible,
    currentEditingChart: state => state.currentEditingChart,
    availableChartTypes: state => state.availableChartTypes,
    unsavedTabs: state => state.tabs.filter(tab => !tab.saved)
  },
  mutations: {
    ADD_TAB(state, tab) {
      const newTab = {
        id: `tab_${Date.now()}`,
        name: tab.name || '新建工作台',
        type: tab.type || 'dashboard',
        active: false,
        saved: false,
        charts: [],
        ...tab
      }
      state.tabs.push(newTab)
      state.activeTabId = newTab.id
    },
    REMOVE_TAB(state, tabId) {
      const index = state.tabs.findIndex(tab => tab.id === tabId)
      if (index !== -1) {
        state.tabs.splice(index, 1)
        // 如果删除的是当前激活标签，切换到第一个标签
        if (state.activeTabId === tabId && state.tabs.length > 0) {
          state.activeTabId = state.tabs[0].id
        }
      }
    },
    SET_ACTIVE_TAB(state, tabId) {
      state.activeTabId = tabId
    },
    UPDATE_TAB(state, updatedTab) {
      const index = state.tabs.findIndex(tab => tab.id === updatedTab.id)
      if (index !== -1) {
        state.tabs.splice(index, 1, { ...state.tabs[index], ...updatedTab })
      }
    },
    SAVE_TAB(state, tabId) {
      const tab = state.tabs.find(tab => tab.id === tabId)
      if (tab) {
        tab.saved = true
      }
    },
    SET_CHART_CONFIG_VISIBLE(state, visible) {
      state.chartConfigVisible = visible
    },
    SET_CURRENT_EDITING_CHART(state, chart) {
      state.currentEditingChart = chart
    },
    ADD_CHART_TO_TAB(state, { tabId, chart }) {
      const tab = state.tabs.find(tab => tab.id === tabId)
      if (tab) {
        const newChart = {
          id: `chart_${Date.now()}`,
          ...chart,
          x: 0,
          y: 0,
          width: 6,
          height: 4
        }
        tab.charts.push(newChart)
        tab.saved = false
      }
    },
    UPDATE_CHART_IN_TAB(state, { tabId, chart }) {
      const tab = state.tabs.find(tab => tab.id === tabId)
      if (tab) {
        const index = tab.charts.findIndex(c => c.id === chart.id)
        if (index !== -1) {
          tab.charts.splice(index, 1, chart)
          tab.saved = false
        }
      }
    },
    REMOVE_CHART_FROM_TAB(state, { tabId, chartId }) {
      const tab = state.tabs.find(tab => tab.id === tabId)
      if (tab) {
        tab.charts = tab.charts.filter(c => c.id !== chartId)
        tab.saved = false
      }
    }
  },
  actions: {
    addTab({ commit }, tab) {
      commit('ADD_TAB', tab)
    },
    removeTab({ commit }, tabId) {
      commit('REMOVE_TAB', tabId)
    },
    setActiveTab({ commit }, tabId) {
      commit('SET_ACTIVE_TAB', tabId)
    },
    updateTab({ commit }, tab) {
      commit('UPDATE_TAB', tab)
    },
    saveTab({ commit }, tabId) {
      commit('SAVE_TAB', tabId)
    },
    showChartConfig({ commit }, chart = null) {
      commit('SET_CURRENT_EDITING_CHART', chart)
      commit('SET_CHART_CONFIG_VISIBLE', true)
    },
    hideChartConfig({ commit }) {
      commit('SET_CHART_CONFIG_VISIBLE', false)
      commit('SET_CURRENT_EDITING_CHART', null)
    },
    addChart({ commit, state }, chart) {
      commit('ADD_CHART_TO_TAB', {
        tabId: state.activeTabId,
        chart
      })
    },
    updateChart({ commit, state }, chart) {
      commit('UPDATE_CHART_IN_TAB', {
        tabId: state.activeTabId,
        chart
      })
    },
    removeChart({ commit, state }, chartId) {
      commit('REMOVE_CHART_FROM_TAB', {
        tabId: state.activeTabId,
        chartId
      })
    }
  }
}
