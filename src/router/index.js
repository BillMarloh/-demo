import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import DataSource from '../views/DataSource.vue'
import ChartWorkspace from '../views/ChartWorkspace.vue'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      title: '数据仪表板',
      icon: 'el-icon-monitor'
    }
  },
  {
    path: '/datasource',
    name: 'DataSource',
    component: DataSource,
    meta: {
      title: '数据源管理',
      icon: 'el-icon-database'
    }
  },
  {
    path: '/workspace',
    name: 'ChartWorkspace',
    component: ChartWorkspace,
    meta: {
      title: '图表工作空间',
      icon: 'el-icon-data-analysis'
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
