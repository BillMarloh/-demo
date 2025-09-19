export default {
  namespaced: true,
  state: {
    // 仪表板配置
    dashboards: [
      {
        id: 1,
        name: '销售数据分析',
        charts: [
          { id: 'chart1', type: 'line', title: '月度销售趋势' },
          { id: 'chart2', type: 'bar', title: '产品销售排行' },
          { id: 'chart3', type: 'pie', title: '销售渠道分布' }
        ]
      },
      {
        id: 2,
        name: '用户行为分析',
        charts: [
          { id: 'chart4', type: 'funnel', title: '用户转化漏斗' },
          { id: 'chart5', type: 'heatmap', title: '用户活跃度热力图' }
        ]
      }
    ],
    currentDashboard: null,
    loading: false
  },
  getters: {
    dashboards: state => state.dashboards,
    currentDashboard: state => state.currentDashboard,
    loading: state => state.loading
  },
  mutations: {
    SET_DASHBOARDS(state, dashboards) {
      state.dashboards = dashboards
    },
    SET_CURRENT_DASHBOARD(state, dashboard) {
      state.currentDashboard = dashboard
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    ADD_DASHBOARD(state, dashboard) {
      state.dashboards.push(dashboard)
    },
    UPDATE_DASHBOARD(state, updatedDashboard) {
      const index = state.dashboards.findIndex(d => d.id === updatedDashboard.id)
      if (index !== -1) {
        state.dashboards.splice(index, 1, updatedDashboard)
      }
    },
    DELETE_DASHBOARD(state, dashboardId) {
      state.dashboards = state.dashboards.filter(d => d.id !== dashboardId)
    }
  },
  actions: {
    async fetchDashboards({ commit }) {
      commit('SET_LOADING', true)
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000))
        // 这里应该是实际的API调用
        commit('SET_LOADING', false)
      } catch (error) {
        commit('SET_LOADING', false)
        throw error
      }
    },
    setCurrentDashboard({ commit }, dashboard) {
      commit('SET_CURRENT_DASHBOARD', dashboard)
    },
    addDashboard({ commit }, dashboard) {
      commit('ADD_DASHBOARD', dashboard)
    },
    updateDashboard({ commit }, dashboard) {
      commit('UPDATE_DASHBOARD', dashboard)
    },
    deleteDashboard({ commit }, dashboardId) {
      commit('DELETE_DASHBOARD', dashboardId)
    }
  }
}
