<template>
  <div class="dashboard-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">数据仪表板</h1>
      <p class="page-description">企业级数据分析和可视化平台</p>
    </div>
    
    <!-- 统计卡片 -->
    <div class="stats-grid">
      <el-card
        v-for="stat in statsData"
        :key="stat.id"
        class="stat-card hover-lift"
        shadow="hover"
      >
        <div class="stat-content">
          <div class="stat-icon" :style="{ backgroundColor: stat.color }">
            <el-icon><component :is="stat.icon" /></el-icon>
          </div>
          <div class="stat-info">
            <h3 class="stat-value">{{ stat.value }}</h3>
            <p class="stat-label">{{ stat.label }}</p>
            <div class="stat-trend" :class="stat.trend.type">
              <el-icon>
                <ArrowUp v-if="stat.trend.type === 'up'" />
                <ArrowDown v-else />
              </el-icon>
              <span>{{ stat.trend.value }}%</span>
            </div>
          </div>
        </div>
      </el-card>
    </div>
    
    <!-- 图表网格 -->
    <div class="charts-grid">
      <!-- 销售趋势图 -->
      <el-card class="chart-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <span class="title">销售趋势分析</span>
            <el-button-group>
              <el-button size="small" type="primary">日</el-button>
              <el-button size="small">周</el-button>
              <el-button size="small">月</el-button>
            </el-button-group>
          </div>
        </template>
        <LineChart
          :data="salesTrendData"
          :options="chartOptions.line"
          height="300px"
        />
      </el-card>
      
      <!-- 产品销售排行 -->
      <el-card class="chart-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <span class="title">产品销售排行</span>
            <el-button type="text" size="small">
              <el-icon><More /></el-icon>
            </el-button>
          </div>
        </template>
        <BarChart
          :data="productSalesData"
          :options="chartOptions.bar"
          height="300px"
        />
      </el-card>
      
      <!-- 销售渠道分布 -->
      <el-card class="chart-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <span class="title">销售渠道分布</span>
            <el-button type="text" size="small">
              <el-icon><Download /></el-icon>
            </el-button>
          </div>
        </template>
        <PieChart
          :data="channelDistributionData"
          :options="chartOptions.pie"
          height="300px"
        />
      </el-card>
      
      <!-- 用户活跃度 -->
      <el-card class="chart-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <span class="title">用户活跃度热力图</span>
            <el-button type="text" size="small">
              <el-icon><Refresh /></el-icon>
            </el-button>
          </div>
        </template>
        <HeatmapChart
          :data="userActivityData"
          :options="chartOptions.heatmap"
          height="300px"
        />
      </el-card>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import {
  TrendCharts,
  DataBoard,
  User,
  Money,
  ArrowUp,
  ArrowDown,
  More,
  Download,
  Refresh
} from '@element-plus/icons-vue'
import LineChart from '@/components/charts/LineChart.vue'
import BarChart from '@/components/charts/BarChart.vue'
import PieChart from '@/components/charts/PieChart.vue'
import HeatmapChart from '@/components/charts/HeatmapChart.vue'

export default {
  name: 'DashboardView',
  components: {
    LineChart,
    BarChart,
    PieChart,
    HeatmapChart,
    TrendCharts,
    DataBoard,
    User,
    Money,
    ArrowUp,
    ArrowDown,
    More,
    Download,
    Refresh
  },
  setup() {
    // 统计数据
    const statsData = ref([
      {
        id: 1,
        label: '总销售额',
        value: '¥2,456,789',
        icon: 'Money',
        color: '#007AFF',
        trend: { type: 'up', value: 12.5 }
      },
      {
        id: 2,
        label: '活跃用户',
        value: '15,234',
        icon: 'User',
        color: '#34C759',
        trend: { type: 'up', value: 8.2 }
      },
      {
        id: 3,
        label: '转化率',
        value: '3.24%',
        icon: 'TrendCharts',
        color: '#FF9500',
        trend: { type: 'down', value: 2.1 }
      },
      {
        id: 4,
        label: '数据源',
        value: '28',
        icon: 'DataBoard',
        color: '#5856D6',
        trend: { type: 'up', value: 15.7 }
      }
    ])
    
    // 销售趋势数据
    const salesTrendData = ref({
      xAxis: ['1月', '2月', '3月', '4月', '5月', '6月'],
      series: [
        {
          name: '销售额',
          data: [820, 932, 901, 934, 1290, 1330]
        },
        {
          name: '利润',
          data: [320, 432, 401, 434, 590, 630]
        }
      ]
    })
    
    // 产品销售数据
    const productSalesData = ref({
      xAxis: ['产品A', '产品B', '产品C', '产品D', '产品E'],
      series: [{
        name: '销售量',
        data: [2340, 1980, 1650, 1230, 980]
      }]
    })
    
    // 渠道分布数据
    const channelDistributionData = ref([
      { name: '线上商城', value: 1048 },
      { name: '线下门店', value: 735 },
      { name: '第三方平台', value: 580 },
      { name: '企业采购', value: 484 },
      { name: '其他', value: 300 }
    ])
    
    // 用户活跃度数据
    const userActivityData = ref({
      xAxis: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      yAxis: ['0-2', '2-4', '4-6', '6-8', '8-10', '10-12', '12-14', '14-16', '16-18', '18-20', '20-22', '22-24'],
      data: generateHeatmapData()
    })
    
    // 图表配置
    const chartOptions = reactive({
      line: {
        smooth: true,
        colors: ['#007AFF', '#34C759']
      },
      bar: {
        colors: ['#007AFF']
      },
      pie: {
        colors: ['#007AFF', '#34C759', '#FF9500', '#5856D6', '#FF3B30']
      },
      heatmap: {
        colors: ['#007AFF', '#34C759']
      }
    })
    
    function generateHeatmapData() {
      const data = []
      const days = 7
      const hours = 12
      
      for (let i = 0; i < days; i++) {
        for (let j = 0; j < hours; j++) {
          data.push([i, j, Math.floor(Math.random() * 100)])
        }
      }
      return data
    }
    
    onMounted(() => {
      // 模拟数据加载
      console.log('Dashboard mounted')
    })
    
    return {
      statsData,
      salesTrendData,
      productSalesData,
      channelDistributionData,
      userActivityData,
      chartOptions
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.dashboard-page {
  .page-header {
    margin-bottom: $spacing-xl;
    
    .page-title {
      font-size: $font-size-3xl;
      font-weight: $font-weight-bold;
      color: $text-primary;
      margin-bottom: $spacing-sm;
    }
    
    .page-description {
      font-size: $font-size-md;
      color: $text-secondary;
      margin: 0;
    }
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: $spacing-lg;
    margin-bottom: $spacing-xl;
    
    .stat-card {
      border-radius: $border-radius-lg;
      border: 1px solid $gray-200;
      
      :deep(.el-card__body) {
        padding: $spacing-lg;
      }
      
      .stat-content {
        display: flex;
        align-items: center;
        gap: $spacing-md;
        
        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: $border-radius-md;
          display: flex;
          align-items: center;
          justify-content: center;
          
          .el-icon {
            font-size: 24px;
            color: white;
          }
        }
        
        .stat-info {
          flex: 1;
          
          .stat-value {
            font-size: $font-size-2xl;
            font-weight: $font-weight-bold;
            color: $text-primary;
            margin: 0 0 $spacing-xs 0;
          }
          
          .stat-label {
            font-size: $font-size-sm;
            color: $text-secondary;
            margin: 0 0 $spacing-xs 0;
          }
          
          .stat-trend {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: $font-size-xs;
            font-weight: $font-weight-medium;
            
            &.up {
              color: $success-color;
            }
            
            &.down {
              color: $danger-color;
            }
            
            .el-icon {
              font-size: 12px;
            }
          }
        }
      }
    }
  }
  
  .charts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: $spacing-lg;
    
    .chart-card {
      border-radius: $border-radius-lg;
      border: 1px solid $gray-200;
      
      :deep(.el-card__header) {
        background-color: $bg-quaternary;
        border-bottom: 1px solid $gray-200;
        padding: $spacing-md $spacing-lg;
      }
      
      :deep(.el-card__body) {
        padding: $spacing-lg;
      }
      
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .title {
          font-size: $font-size-lg;
          font-weight: $font-weight-semibold;
          color: $text-primary;
        }
      }
    }
  }
}

@media (max-width: $breakpoint-lg) {
  .dashboard-page {
    .stats-grid {
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    }
    
    .charts-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>
