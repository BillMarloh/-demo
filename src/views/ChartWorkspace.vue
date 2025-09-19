<template>
  <div class="workspace-page">
    <!-- 工作空间标签页 -->
    <div class="workspace-tabs">
      <el-tabs
        v-model="activeTabId"
        type="card"
        closable
        @tab-remove="removeTab"
        @tab-click="setActiveTab"
        class="workspace-tabs-container"
      >
        <el-tab-pane
          v-for="tab in tabs"
          :key="tab.id"
          :label="tab.name"
          :name="tab.id"
          :closable="tabs.length > 1"
        >
          <template #label>
            <span class="tab-label">
              <span class="tab-name">{{ tab.name }}</span>
              <el-icon v-if="!tab.saved" class="unsaved-indicator"><Warning /></el-icon>
            </span>
          </template>
          
          <!-- 工作空间内容 -->
          <div class="workspace-content">
            <!-- 工具栏 -->
            <div class="toolbar">
              <div class="toolbar-left">
                <el-button-group>
                  <el-button
                    v-for="chartType in availableChartTypes"
                    :key="chartType.type"
                    size="small"
                    @click="addChart(chartType)"
                  >
                    <el-icon><component :is="chartType.icon" /></el-icon>
                    {{ chartType.name }}
                  </el-button>
                </el-button-group>
              </div>
              
              <div class="toolbar-right">
                <el-button size="small" @click="saveTab(tab.id)" :disabled="tab.saved">
                  <el-icon><Document /></el-icon>
                  保存
                </el-button>
                <el-button size="small" @click="exportDashboard">
                  <el-icon><Download /></el-icon>
                  导出
                </el-button>
                <el-button size="small" @click="previewDashboard">
                  <el-icon><View /></el-icon>
                  预览
                </el-button>
              </div>
            </div>
            
            <!-- 图表画布 -->
            <div class="chart-canvas" ref="canvasRef">
              <div
                v-if="activeTab?.charts.length === 0"
                class="empty-canvas"
              >
                <el-empty description="暂无图表">
                  <el-button type="primary" @click="showChartConfig()">添加第一个图表</el-button>
                </el-empty>
              </div>
              
              <div
                v-for="chart in activeTab?.charts"
                :key="chart.id"
                class="chart-item"
                :style="getChartStyle(chart)"
                @click="selectChart(chart)"
                :class="{ active: currentEditingChart?.id === chart.id }"
              >
                <div class="chart-header">
                  <span class="chart-title">{{ chart.title }}</span>
                  <div class="chart-actions">
                    <el-button
                      type="text"
                      size="small"
                      @click.stop="editChart(chart)"
                    >
                      <el-icon><Edit /></el-icon>
                    </el-button>
                    <el-button
                      type="text"
                      size="small"
                      @click.stop="removeChart(chart.id)"
                    >
                      <el-icon><Delete /></el-icon>
                    </el-button>
                  </div>
                </div>
                
                <div class="chart-content">
                  <component
                    :is="getChartComponent(chart.type)"
                    :data="chart.data"
                    :options="chart.options"
                    :height="chart.height + 'px'"
                  />
                </div>
                
                <!-- 调整大小控制点 -->
                <div class="resize-handles">
                  <div class="resize-handle bottom-right" @mousedown="startResize($event, chart, 'se')"></div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        
        <!-- 添加新标签页按钮 -->
        <template #addIcon>
          <el-button type="text" @click="addNewTab">
            <el-icon><Plus /></el-icon>
          </el-button>
        </template>
      </el-tabs>
    </div>

    <!-- 图表配置面板 -->
    <el-drawer
      v-model="chartConfigVisible"
      title="图表配置"
      :size="400"
      direction="rtl"
    >
      <ChartConfigPanel
        v-if="chartConfigVisible"
        :chart="currentEditingChart"
        @save="handleChartSave"
        @cancel="hideChartConfig"
      />
    </el-drawer>

    <!-- 新建标签页对话框 -->
    <el-dialog
      v-model="showNewTabDialog"
      title="新建工作台"
      width="500px"
    >
      <el-form :model="newTabForm" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="newTabForm.name" placeholder="请输入工作台名称" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="newTabForm.type" style="width: 100%">
            <el-option label="仪表板" value="dashboard" />
            <el-option label="报表" value="report" />
            <el-option label="分析" value="analysis" />
          </el-select>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showNewTabDialog = false">取消</el-button>
          <el-button type="primary" @click="createNewTab">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus,
  Warning,
  Document,
  Download,
  View,
  Edit,
  Delete,
  DataLine,
  DataBoard,
  PieChart as PieChartIcon
} from '@element-plus/icons-vue'
import LineChart from '@/components/charts/LineChart.vue'
import BarChart from '@/components/charts/BarChart.vue'
import PieChart from '@/components/charts/PieChart.vue'
import HeatmapChart from '@/components/charts/HeatmapChart.vue'
import ChartConfigPanel from '@/components/common/ChartConfigPanel.vue'

export default {
  name: 'ChartWorkspace',
  components: {
    LineChart,
    BarChart,
    PieChart,
    HeatmapChart,
    ChartConfigPanel,
    Plus,
    Warning,
    Document,
    Download,
    View,
    Edit,
    Delete,
    DataLine,
    DataBoard,
    PieChartIcon
  },
  setup() {
    const store = useStore()
    const canvasRef = ref(null)
    
    // 响应式数据
    const showNewTabDialog = ref(false)
    const newTabForm = ref({
      name: '',
      type: 'dashboard'
    })
    
    // 计算属性
    const tabs = computed(() => store.getters['workspace/tabs'])
    const activeTab = computed(() => store.getters['workspace/activeTab'])
    const activeTabId = computed({
      get: () => store.getters['workspace/activeTabId'],
      set: (value) => store.dispatch('workspace/setActiveTab', value)
    })
    const chartConfigVisible = computed(() => store.getters['workspace/chartConfigVisible'])
    const currentEditingChart = computed(() => store.getters['workspace/currentEditingChart'])
    const availableChartTypes = computed(() => store.getters['workspace/availableChartTypes'])
    
    // 图表组件映射
    const chartComponentMap = {
      line: LineChart,
      bar: BarChart,
      pie: PieChart,
      heatmap: HeatmapChart
    }
    
    // 方法
    const addNewTab = () => {
      showNewTabDialog.value = true
    }
    
    const createNewTab = () => {
      if (!newTabForm.value.name.trim()) {
        ElMessage.warning('请输入工作台名称')
        return
      }
      
      store.dispatch('workspace/addTab', {
        name: newTabForm.value.name,
        type: newTabForm.value.type
      })
      
      showNewTabDialog.value = false
      newTabForm.value = { name: '', type: 'dashboard' }
    }
    
    const removeTab = async (tabId) => {
      const tab = tabs.value.find(t => t.id === tabId)
      if (tab && !tab.saved) {
        try {
          await ElMessageBox.confirm('工作台有未保存的更改，确定要关闭吗？', '确认关闭', {
            type: 'warning'
          })
        } catch {
          return // 用户取消
        }
      }
      
      store.dispatch('workspace/removeTab', tabId)
    }
    
    const setActiveTab = (tab) => {
      store.dispatch('workspace/setActiveTab', tab.paneName)
    }
    
    const saveTab = (tabId) => {
      store.dispatch('workspace/saveTab', tabId)
      ElMessage.success('保存成功')
    }
    
    const addChart = (chartType) => {
      const newChart = {
        type: chartType.type,
        title: `新建${chartType.name}`,
        data: generateMockData(chartType.type),
        options: getDefaultOptions(chartType.type),
        width: 400,
        height: 300,
        x: 0,
        y: 0
      }
      
      store.dispatch('workspace/addChart', newChart)
    }
    
    const selectChart = (chart) => {
      store.dispatch('workspace/showChartConfig', chart)
    }
    
    const editChart = (chart) => {
      store.dispatch('workspace/showChartConfig', chart)
    }
    
    const removeChart = async (chartId) => {
      try {
        await ElMessageBox.confirm('确定要删除这个图表吗？', '确认删除', {
          type: 'warning'
        })
        store.dispatch('workspace/removeChart', chartId)
        ElMessage.success('删除成功')
      } catch {
        // 用户取消删除
      }
    }
    
    const showChartConfig = (chart = null) => {
      store.dispatch('workspace/showChartConfig', chart)
    }
    
    const hideChartConfig = () => {
      store.dispatch('workspace/hideChartConfig')
    }
    
    const handleChartSave = (chartData) => {
      if (currentEditingChart.value) {
        store.dispatch('workspace/updateChart', {
          ...currentEditingChart.value,
          ...chartData
        })
      } else {
        store.dispatch('workspace/addChart', chartData)
      }
      hideChartConfig()
      ElMessage.success('保存成功')
    }
    
    const getChartComponent = (type) => {
      return chartComponentMap[type] || LineChart
    }
    
    const getChartStyle = (chart) => {
      return {
        position: 'absolute',
        left: chart.x + 'px',
        top: chart.y + 'px',
        width: chart.width + 'px',
        height: (chart.height + 40) + 'px' // 包含标题高度
      }
    }
    
    const generateMockData = (type) => {
      switch (type) {
        case 'line':
          return {
            xAxis: ['1月', '2月', '3月', '4月', '5月', '6月'],
            series: [{
              name: '数据1',
              data: [120, 200, 150, 80, 70, 110]
            }]
          }
        case 'bar':
          return {
            xAxis: ['A', 'B', 'C', 'D', 'E'],
            series: [{
              name: '数据1',
              data: [20, 40, 30, 50, 35]
            }]
          }
        case 'pie':
          return [
            { name: '类别A', value: 335 },
            { name: '类别B', value: 310 },
            { name: '类别C', value: 274 },
            { name: '类别D', value: 235 },
            { name: '类别E', value: 400 }
          ]
        default:
          return {}
      }
    }
    
    const getDefaultOptions = () => {
      return {
        title: '',
        colors: ['#007AFF', '#34C759', '#FF9500', '#5856D6', '#FF3B30']
      }
    }
    
    const exportDashboard = () => {
      ElMessage.info('导出功能开发中...')
    }
    
    const previewDashboard = () => {
      ElMessage.info('预览功能开发中...')
    }
    
    // 拖拽和调整大小相关
    let isResizing = false
    let resizeChart = null
    let startX = 0
    let startY = 0
    let startWidth = 0
    let startHeight = 0
    
    const startResize = (event, chart) => {
      event.preventDefault()
      isResizing = true
      resizeChart = chart
      startX = event.clientX
      startY = event.clientY
      startWidth = chart.width
      startHeight = chart.height
      
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }
    
    const handleMouseMove = (event) => {
      if (isResizing && resizeChart) {
        const deltaX = event.clientX - startX
        const deltaY = event.clientY - startY
        
        const newWidth = Math.max(200, startWidth + deltaX)
        const newHeight = Math.max(150, startHeight + deltaY)
        
        store.dispatch('workspace/updateChart', {
          ...resizeChart,
          width: newWidth,
          height: newHeight
        })
      }
    }
    
    const handleMouseUp = () => {
      isResizing = false
      resizeChart = null
      
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
    
    onMounted(() => {
      // 初始化
    })
    
    onBeforeUnmount(() => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    })
    
    return {
      canvasRef,
      showNewTabDialog,
      newTabForm,
      tabs,
      activeTab,
      activeTabId,
      chartConfigVisible,
      currentEditingChart,
      availableChartTypes,
      addNewTab,
      createNewTab,
      removeTab,
      setActiveTab,
      saveTab,
      addChart,
      selectChart,
      editChart,
      removeChart,
      showChartConfig,
      hideChartConfig,
      handleChartSave,
      getChartComponent,
      getChartStyle,
      exportDashboard,
      previewDashboard,
      startResize
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.workspace-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  
  .workspace-tabs {
    flex: 1;
    display: flex;
    flex-direction: column;
    
    .workspace-tabs-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      
      :deep(.el-tabs__header) {
        margin: 0;
        background: $white;
        border-bottom: 1px solid $gray-200;
        
        .el-tabs__nav {
          .el-tabs__item {
            border-radius: $border-radius-md $border-radius-md 0 0;
            
            .tab-label {
              display: flex;
              align-items: center;
              gap: $spacing-xs;
              
              .unsaved-indicator {
                color: $warning-color;
                font-size: 12px;
              }
            }
          }
        }
      }
      
      :deep(.el-tabs__content) {
        flex: 1;
        padding: 0;
        
        .el-tab-pane {
          height: 100%;
        }
      }
    }
    
    .workspace-content {
      height: 100%;
      display: flex;
      flex-direction: column;
      
      .toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: $spacing-md;
        background: $bg-quaternary;
        border-bottom: 1px solid $gray-200;
        
        .toolbar-left {
          .el-button-group {
            .el-button {
              font-size: $font-size-xs;
              padding: $spacing-xs $spacing-sm;
              
              .el-icon {
                margin-right: 4px;
              }
            }
          }
        }
        
        .toolbar-right {
          display: flex;
          gap: $spacing-sm;
        }
      }
      
      .chart-canvas {
        flex: 1;
        position: relative;
        background: $bg-secondary;
        overflow: auto;
        min-height: 600px;
        
        .empty-canvas {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
        }
        
        .chart-item {
          background: $white;
          border: 2px solid transparent;
          border-radius: $border-radius-md;
          box-shadow: $shadow-sm;
          cursor: move;
          transition: all $transition-fast;
          
          &:hover {
            box-shadow: $shadow-md;
            border-color: $gray-300;
          }
          
          &.active {
            border-color: $primary-color;
            box-shadow: 0 0 0 4px rgba($primary-color, 0.1);
          }
          
          .chart-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: $spacing-sm $spacing-md;
            border-bottom: 1px solid $gray-200;
            background: $bg-quaternary;
            
            .chart-title {
              font-size: $font-size-sm;
              font-weight: $font-weight-medium;
              color: $text-primary;
            }
            
            .chart-actions {
              display: flex;
              gap: 4px;
              opacity: 0;
              transition: opacity $transition-fast;
            }
          }
          
          &:hover .chart-actions {
            opacity: 1;
          }
          
          .chart-content {
            padding: $spacing-md;
            height: calc(100% - 40px);
          }
          
          .resize-handles {
            .resize-handle {
              position: absolute;
              background: $primary-color;
              
              &.bottom-right {
                bottom: -2px;
                right: -2px;
                width: 8px;
                height: 8px;
                cursor: se-resize;
                border-radius: 2px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
