export default {
  namespaced: true,
  state: {
    // 数据源列表
    dataSources: [
      {
        id: 1,
        name: 'MySQL数据库',
        type: 'mysql',
        host: 'localhost:3306',
        database: 'analytics_db',
        status: 'connected',
        lastSync: '2024-01-15 10:30:00'
      },
      {
        id: 2,
        name: 'Redis缓存',
        type: 'redis',
        host: 'localhost:6379',
        database: '0',
        status: 'connected',
        lastSync: '2024-01-15 10:25:00'
      },
      {
        id: 3,
        name: 'CSV文件',
        type: 'csv',
        path: '/data/sales_data.csv',
        status: 'ready',
        lastSync: '2024-01-15 09:00:00'
      }
    ],
    currentDataSource: null,
    connectionTesting: false,
    syncInProgress: false
  },
  getters: {
    dataSources: state => state.dataSources,
    currentDataSource: state => state.currentDataSource,
    connectedDataSources: state => state.dataSources.filter(ds => ds.status === 'connected'),
    connectionTesting: state => state.connectionTesting,
    syncInProgress: state => state.syncInProgress
  },
  mutations: {
    SET_DATA_SOURCES(state, dataSources) {
      state.dataSources = dataSources
    },
    SET_CURRENT_DATA_SOURCE(state, dataSource) {
      state.currentDataSource = dataSource
    },
    ADD_DATA_SOURCE(state, dataSource) {
      state.dataSources.push(dataSource)
    },
    UPDATE_DATA_SOURCE(state, updatedDataSource) {
      const index = state.dataSources.findIndex(ds => ds.id === updatedDataSource.id)
      if (index !== -1) {
        state.dataSources.splice(index, 1, updatedDataSource)
      }
    },
    DELETE_DATA_SOURCE(state, dataSourceId) {
      state.dataSources = state.dataSources.filter(ds => ds.id !== dataSourceId)
    },
    SET_CONNECTION_TESTING(state, testing) {
      state.connectionTesting = testing
    },
    SET_SYNC_IN_PROGRESS(state, syncing) {
      state.syncInProgress = syncing
    }
  },
  actions: {
    async testConnection({ commit }, dataSource) {
      commit('SET_CONNECTION_TESTING', true)
      try {
        // 模拟连接测试
        await new Promise(resolve => setTimeout(resolve, 2000))
        const updatedDataSource = { ...dataSource, status: 'connected' }
        commit('UPDATE_DATA_SOURCE', updatedDataSource)
        commit('SET_CONNECTION_TESTING', false)
        return { success: true, message: '连接成功' }
      } catch (error) {
        commit('SET_CONNECTION_TESTING', false)
        return { success: false, message: '连接失败' }
      }
    },
    async syncData({ commit, state }, dataSourceId) {
      commit('SET_SYNC_IN_PROGRESS', true)
      try {
        // 模拟数据同步
        await new Promise(resolve => setTimeout(resolve, 3000))
        const dataSource = state.dataSources.find(ds => ds.id === dataSourceId)
        if (dataSource) {
          const updatedDataSource = {
            ...dataSource,
            lastSync: new Date().toLocaleString('zh-CN')
          }
          commit('UPDATE_DATA_SOURCE', updatedDataSource)
        }
        commit('SET_SYNC_IN_PROGRESS', false)
        return { success: true, message: '数据同步完成' }
      } catch (error) {
        commit('SET_SYNC_IN_PROGRESS', false)
        return { success: false, message: '数据同步失败' }
      }
    },
    addDataSource({ commit }, dataSource) {
      const newDataSource = {
        ...dataSource,
        id: Date.now(),
        status: 'pending',
        lastSync: null
      }
      commit('ADD_DATA_SOURCE', newDataSource)
    },
    updateDataSource({ commit }, dataSource) {
      commit('UPDATE_DATA_SOURCE', dataSource)
    },
    deleteDataSource({ commit }, dataSourceId) {
      commit('DELETE_DATA_SOURCE', dataSourceId)
    }
  }
}
