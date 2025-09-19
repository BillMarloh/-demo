<template>
  <div class="chart-config-panel">
    <el-form :model="formData" label-width="80px" size="small">
      <!-- 基础配置 -->
      <div class="config-section">
        <h4 class="section-title">基础配置</h4>
        
        <el-form-item label="图表标题">
          <el-input v-model="formData.title" placeholder="请输入图表标题" />
        </el-form-item>
        
        <el-form-item label="图表类型">
          <el-select v-model="formData.type" style="width: 100%" @change="handleTypeChange">
            <el-option
              v-for="type in chartTypes"
              :key="type.value"
              :label="type.label"
              :value="type.value"
            >
              <el-icon><component :is="type.icon" /></el-icon>
              <span style="margin-left: 8px;">{{ type.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="尺寸">
          <div class="size-inputs">
            <el-input-number
              v-model="formData.width"
              :min="200"
              :max="1200"
              :step="50"
              size="small"
              controls-position="right"
            />
            <span class="size-separator">×</span>
            <el-input-number
              v-model="formData.height"
              :min="150"
              :max="800"
              :step="50"
              size="small"
              controls-position="right"
            />
          </div>
        </el-form-item>
      </div>
      
      <!-- 数据配置 -->
      <div class="config-section">
        <h4 class="section-title">数据配置</h4>
        
        <el-form-item label="数据源">
          <el-select v-model="formData.dataSource" style="width: 100%">
            <el-option
              v-for="source in dataSources"
              :key="source.id"
              :label="source.name"
              :value="source.id"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="数据表">
          <el-select v-model="formData.dataTable" style="width: 100%">
            <el-option
              v-for="table in dataTables"
              :key="table"
              :label="table"
              :value="table"
            />
          </el-select>
        </el-form-item>
        
        <!-- 动态数据配置 -->
        <div v-if="formData.type === 'line' || formData.type === 'bar'">
          <el-form-item label="X轴字段">
            <el-select v-model="formData.xAxisField" style="width: 100%">
              <el-option
                v-for="field in dataFields"
                :key="field"
                :label="field"
                :value="field"
              />
            </el-select>
          </el-form-item>
          
          <el-form-item label="Y轴字段">
            <el-select v-model="formData.yAxisField" style="width: 100%" multiple>
              <el-option
                v-for="field in dataFields"
                :key="field"
                :label="field"
                :value="field"
              />
            </el-select>
          </el-form-item>
        </div>
        
        <div v-if="formData.type === 'pie'">
          <el-form-item label="分类字段">
            <el-select v-model="formData.categoryField" style="width: 100%">
              <el-option
                v-for="field in dataFields"
                :key="field"
                :label="field"
                :value="field"
              />
            </el-select>
          </el-form-item>
          
          <el-form-item label="数值字段">
            <el-select v-model="formData.valueField" style="width: 100%">
              <el-option
                v-for="field in dataFields"
                :key="field"
                :label="field"
                :value="field"
              />
            </el-select>
          </el-form-item>
        </div>
      </div>
      
      <!-- 样式配置 -->
      <div class="config-section">
        <h4 class="section-title">样式配置</h4>
        
        <el-form-item label="配色方案">
          <div class="color-schemes">
            <div
              v-for="(scheme, index) in colorSchemes"
              :key="index"
              class="color-scheme"
              :class="{ active: selectedColorScheme === index }"
              @click="selectColorScheme(index)"
            >
              <div
                v-for="color in scheme"
                :key="color"
                class="color-item"
                :style="{ backgroundColor: color }"
              ></div>
            </div>
          </div>
        </el-form-item>
        
        <el-form-item v-if="formData.type === 'line'" label="线条样式">
          <el-switch
            v-model="formData.options.smooth"
            active-text="平滑"
            inactive-text="直线"
          />
        </el-form-item>
        
        <el-form-item v-if="formData.type === 'line'" label="填充区域">
          <el-switch
            v-model="formData.options.area"
            active-text="开启"
            inactive-text="关闭"
          />
        </el-form-item>
        
        <el-form-item label="显示图例">
          <el-switch
            v-model="formData.options.showLegend"
            active-text="显示"
            inactive-text="隐藏"
          />
        </el-form-item>
        
        <el-form-item label="显示网格">
          <el-switch
            v-model="formData.options.showGrid"
            active-text="显示"
            inactive-text="隐藏"
          />
        </el-form-item>
      </div>
      
      <!-- 交互配置 -->
      <div class="config-section">
        <h4 class="section-title">交互配置</h4>
        
        <el-form-item label="数据缩放">
          <el-switch
            v-model="formData.options.dataZoom"
            active-text="开启"
            inactive-text="关闭"
          />
        </el-form-item>
        
        <el-form-item label="数据刷选">
          <el-switch
            v-model="formData.options.brush"
            active-text="开启"
            inactive-text="关闭"
          />
        </el-form-item>
        
        <el-form-item label="动画效果">
          <el-switch
            v-model="formData.options.animation"
            active-text="开启"
            inactive-text="关闭"
          />
        </el-form-item>
      </div>
    </el-form>
    
    <!-- 预览区域 -->
    <div class="preview-section">
      <h4 class="section-title">预览</h4>
      <div class="preview-container">
        <component
          :is="getChartComponent(formData.type)"
          :data="previewData"
          :options="formData.options"
          height="200px"
        />
      </div>
    </div>
    
    <!-- 操作按钮 -->
    <div class="action-buttons">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSave">保存</el-button>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import {
  DataLine,
  DataBoard,
  PieChart as PieChartIcon,
  Odometer
} from '@element-plus/icons-vue'
import LineChart from '@/components/charts/LineChart.vue'
import BarChart from '@/components/charts/BarChart.vue'
import PieChart from '@/components/charts/PieChart.vue'
import HeatmapChart from '@/components/charts/HeatmapChart.vue'

export default {
  name: 'ChartConfigPanel',
  components: {
    LineChart,
    BarChart,
    PieChart,
    HeatmapChart,
    DataLine,
    DataBoard,
    PieChartIcon,
    Odometer
  },
  props: {
    chart: {
      type: Object,
      default: null
    }
  },
  emits: ['save', 'cancel'],
  setup(props, { emit }) {
    const store = useStore()
    
    // 表单数据
    const formData = ref({
      title: '',
      type: 'line',
      width: 400,
      height: 300,
      dataSource: '',
      dataTable: '',
      xAxisField: '',
      yAxisField: [],
      categoryField: '',
      valueField: '',
      options: {
        smooth: true,
        area: false,
        showLegend: true,
        showGrid: true,
        dataZoom: false,
        brush: false,
        animation: true,
        colors: ['#007AFF', '#34C759', '#FF9500', '#5856D6', '#FF3B30']
      }
    })
    
    // 图表类型配置
    const chartTypes = [
      { value: 'line', label: '折线图', icon: 'DataLine' },
      { value: 'bar', label: '柱状图', icon: 'DataBoard' },
      { value: 'pie', label: '饼图', icon: 'PieChartIcon' },
      { value: 'heatmap', label: '热力图', icon: 'Odometer' }
    ]
    
    // 配色方案
    const colorSchemes = [
      ['#007AFF', '#34C759', '#FF9500', '#5856D6', '#FF3B30'],
      ['#1890ff', '#52c41a', '#faad14', '#722ed1', '#f5222d'],
      ['#2F54EB', '#52C41A', '#FAAD14', '#F759AB', '#13C2C2'],
      ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57']
    ]
    
    const selectedColorScheme = ref(0)
    
    // 计算属性
    const dataSources = computed(() => store.getters['dataSource/dataSources'])
    const dataTables = ref(['sales_data', 'user_data', 'product_data'])
    const dataFields = ref(['id', 'name', 'value', 'date', 'category', 'amount'])
    
    const previewData = computed(() => {
      // 根据图表类型生成预览数据
      switch (formData.value.type) {
        case 'line':
          return {
            xAxis: ['1月', '2月', '3月', '4月', '5月'],
            series: [{
              name: '示例数据',
              data: [120, 200, 150, 80, 170]
            }]
          }
        case 'bar':
          return {
            xAxis: ['A', 'B', 'C', 'D', 'E'],
            series: [{
              name: '示例数据',
              data: [20, 40, 30, 50, 35]
            }]
          }
        case 'pie':
          return [
            { name: '类别A', value: 335 },
            { name: '类别B', value: 310 },
            { name: '类别C', value: 274 },
            { name: '类别D', value: 235 }
          ]
        case 'heatmap':
          return {
            xAxis: ['周一', '周二', '周三', '周四', '周五'],
            yAxis: ['上午', '下午', '晚上'],
            data: [[0, 0, 5], [0, 1, 1], [0, 2, 0], [1, 0, 1], [1, 1, 4]]
          }
        default:
          return {}
      }
    })
    
    // 图表组件映射
    const chartComponentMap = {
      line: LineChart,
      bar: BarChart,
      pie: PieChart,
      heatmap: HeatmapChart
    }
    
    // 方法
    const getChartComponent = (type) => {
      return chartComponentMap[type] || LineChart
    }
    
    const handleTypeChange = () => {
      // 重置相关字段
      formData.value.xAxisField = ''
      formData.value.yAxisField = []
      formData.value.categoryField = ''
      formData.value.valueField = ''
    }
    
    const selectColorScheme = (index) => {
      selectedColorScheme.value = index
      formData.value.options.colors = [...colorSchemes[index]]
    }
    
    const handleSave = () => {
      emit('save', formData.value)
    }
    
    const handleCancel = () => {
      emit('cancel')
    }
    
    // 初始化表单数据
    const initFormData = () => {
      if (props.chart) {
        formData.value = {
          ...formData.value,
          ...props.chart,
          options: {
            ...formData.value.options,
            ...props.chart.options
          }
        }
      }
    }
    
    // 监听图表变化
    watch(() => props.chart, initFormData, { immediate: true })
    
    onMounted(() => {
      initFormData()
    })
    
    return {
      formData,
      chartTypes,
      colorSchemes,
      selectedColorScheme,
      dataSources,
      dataTables,
      dataFields,
      previewData,
      getChartComponent,
      handleTypeChange,
      selectColorScheme,
      handleSave,
      handleCancel
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.chart-config-panel {
  padding: $spacing-lg;
  height: 100%;
  overflow-y: auto;
  
  .config-section {
    margin-bottom: $spacing-xl;
    
    .section-title {
      font-size: $font-size-md;
      font-weight: $font-weight-semibold;
      color: $text-primary;
      margin: 0 0 $spacing-md 0;
      padding-bottom: $spacing-xs;
      border-bottom: 1px solid $gray-200;
    }
    
    .size-inputs {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      
      .size-separator {
        color: $text-tertiary;
        font-weight: $font-weight-medium;
      }
    }
    
    .color-schemes {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: $spacing-sm;
      
      .color-scheme {
        display: flex;
        padding: $spacing-xs;
        border: 2px solid transparent;
        border-radius: $border-radius-md;
        cursor: pointer;
        transition: all $transition-fast;
        
        &:hover {
          border-color: $gray-300;
        }
        
        &.active {
          border-color: $primary-color;
          background-color: rgba($primary-color, 0.05);
        }
        
        .color-item {
          width: 16px;
          height: 16px;
          border-radius: 2px;
          margin-right: 2px;
          
          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
  }
  
  .preview-section {
    margin-bottom: $spacing-xl;
    
    .section-title {
      font-size: $font-size-md;
      font-weight: $font-weight-semibold;
      color: $text-primary;
      margin: 0 0 $spacing-md 0;
      padding-bottom: $spacing-xs;
      border-bottom: 1px solid $gray-200;
    }
    
    .preview-container {
      background: $white;
      border: 1px solid $gray-200;
      border-radius: $border-radius-md;
      padding: $spacing-md;
      height: 240px;
    }
  }
  
  .action-buttons {
    display: flex;
    gap: $spacing-sm;
    justify-content: flex-end;
    padding-top: $spacing-md;
    border-top: 1px solid $gray-200;
    
    .el-button {
      min-width: 80px;
    }
  }
}

:deep(.el-form-item) {
  margin-bottom: $spacing-md;
  
  .el-form-item__label {
    color: $text-secondary;
    font-weight: $font-weight-medium;
  }
}

:deep(.el-select) {
  .el-select__wrapper {
    .el-select__selection {
      .el-select__selected-item {
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
