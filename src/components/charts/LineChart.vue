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
  name: 'LineChart',
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
          trigger: 'axis',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: '#E5E5EA',
          borderWidth: 1,
          borderRadius: 8,
          textStyle: {
            color: '#1C1C1E',
            fontSize: 12
          },
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#007AFF'
            }
          }
        },
        legend: {
          data: props.data.series?.map(s => s.name) || [],
          top: 30,
          textStyle: {
            color: '#3C3C43',
            fontSize: 12
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: props.data.xAxis || [],
          axisLine: {
            lineStyle: {
              color: '#E5E5EA'
            }
          },
          axisLabel: {
            color: '#8E8E93',
            fontSize: 11
          },
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#8E8E93',
            fontSize: 11
          },
          splitLine: {
            lineStyle: {
              color: '#F2F2F7',
              type: 'solid'
            }
          }
        },
        series: (props.data.series || []).map((item, index) => ({
          name: item.name,
          type: 'line',
          smooth: props.options.smooth !== false,
          data: item.data,
          lineStyle: {
            width: 3,
            color: props.options.colors?.[index] || '#007AFF'
          },
          itemStyle: {
            color: props.options.colors?.[index] || '#007AFF',
            borderWidth: 2,
            borderColor: '#FFFFFF'
          },
          areaStyle: props.options.area ? {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0,
                color: `${props.options.colors?.[index] || '#007AFF'}20`
              }, {
                offset: 1,
                color: `${props.options.colors?.[index] || '#007AFF'}05`
              }]
            }
          } : null,
          emphasis: {
            focus: 'series',
            itemStyle: {
              shadowBlur: 10,
              shadowColor: `${props.options.colors?.[index] || '#007AFF'}40`
            }
          }
        })),
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
