<template>
  <BaseChart
    :options="chartOptions"
    :width="width"
    :height="height"
    :theme="theme"
    @chart-ready="onChartReady"
    @chart-click="onChartClick"
  />
</template>

<script>
import { computed } from 'vue'
import BaseChart from './BaseChart.vue'

export default {
  name: 'HeatmapChart',
  components: {
    BaseChart
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    options: {
      type: Object,
      default: () => ({})
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
    const chartOptions = computed(() => {
      const defaultOptions = {
        title: {
          text: props.options.title || '',
          left: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#1C1C1E'
          }
        },
        tooltip: {
          position: 'top',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: '#E5E5EA',
          borderWidth: 1,
          borderRadius: 8,
          textStyle: {
            color: '#1C1C1E',
            fontSize: 12
          },
          formatter: function (params) {
            return `${props.data.xAxis[params.data[0]]}<br/>${props.data.yAxis[params.data[1]]}: ${params.data[2]}`
          }
        },
        grid: {
          height: '50%',
          top: '10%'
        },
        xAxis: {
          type: 'category',
          data: props.data.xAxis || [],
          splitArea: {
            show: true
          },
          axisLabel: {
            color: '#8E8E93',
            fontSize: 11
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          }
        },
        yAxis: {
          type: 'category',
          data: props.data.yAxis || [],
          splitArea: {
            show: true
          },
          axisLabel: {
            color: '#8E8E93',
            fontSize: 11
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          }
        },
        visualMap: {
          min: 0,
          max: 100,
          calculable: true,
          orient: 'horizontal',
          left: 'center',
          bottom: '15%',
          textStyle: {
            color: '#8E8E93',
            fontSize: 11
          },
          inRange: {
            color: [
              '#E8F4FD',
              '#B3D9F7',
              '#7DBEF1',
              '#47A3EB',
              '#007AFF'
            ]
          }
        },
        series: [{
          name: props.options.name || '热力数据',
          type: 'heatmap',
          data: props.data.data || [],
          label: {
            show: props.options.showLabel !== false,
            color: '#1C1C1E',
            fontSize: 10
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }],
        animation: true,
        animationDuration: 1000,
        animationEasing: 'cubicOut'
      }
      
      // 合并自定义配置
      return { ...defaultOptions, ...props.options }
    })
    
    const onChartReady = (chart) => {
      emit('chart-ready', chart)
    }
    
    const onChartClick = (params) => {
      emit('chart-click', params)
    }
    
    return {
      chartOptions,
      onChartReady,
      onChartClick
    }
  }
}
</script>
