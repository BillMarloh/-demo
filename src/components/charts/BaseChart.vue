<template>
  <div
    ref="chartRef"
    class="base-chart"
    :style="{ width: width, height: height }"
  ></div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import * as echarts from 'echarts'

export default {
  name: 'BaseChart',
  props: {
    options: {
      type: Object,
      required: true
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '400px'
    },
    theme: {
      type: String,
      default: 'light'
    }
  },
  emits: ['chart-ready', 'chart-click'],
  setup(props, { emit }) {
    const chartRef = ref(null)
    let chartInstance = null
    
    // 初始化图表
    const initChart = async () => {
      if (!chartRef.value) return
      
      await nextTick()
      
      // 销毁已存在的实例
      if (chartInstance) {
        chartInstance.dispose()
      }
      
      // 创建新实例
      chartInstance = echarts.init(chartRef.value, props.theme)
      
      // 设置配置项
      chartInstance.setOption(props.options)
      
      // 绑定事件
      chartInstance.on('click', (params) => {
        emit('chart-click', params)
      })
      
      // 触发准备完成事件
      emit('chart-ready', chartInstance)
    }
    
    // 更新图表
    const updateChart = () => {
      if (chartInstance && props.options) {
        chartInstance.setOption(props.options, true)
      }
    }
    
    // 重置图表大小
    const resizeChart = () => {
      if (chartInstance) {
        chartInstance.resize()
      }
    }
    
    // 监听配置变化
    watch(() => props.options, updateChart, { deep: true })
    watch(() => props.theme, initChart)
    
    // 监听窗口大小变化
    const handleResize = () => {
      resizeChart()
    }
    
    onMounted(() => {
      initChart()
      window.addEventListener('resize', handleResize)
    })
    
    onBeforeUnmount(() => {
      if (chartInstance) {
        chartInstance.dispose()
        chartInstance = null
      }
      window.removeEventListener('resize', handleResize)
    })
    
    return {
      chartRef,
      resizeChart,
      updateChart
    }
  }
}
</script>

<style lang="scss" scoped>
.base-chart {
  width: 100%;
  height: 100%;
}
</style>
