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
  name: 'PieChart',
  components: {
    BaseChart
  },
  props: {
    data: {
      type: Array,
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
          trigger: 'item',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: '#E5E5EA',
          borderWidth: 1,
          borderRadius: 8,
          textStyle: {
            color: '#1C1C1E',
            fontSize: 12
          },
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          top: 'middle',
          textStyle: {
            color: '#3C3C43',
            fontSize: 12
          },
          itemGap: 10,
          itemWidth: 12,
          itemHeight: 12
        },
        series: [
          {
            name: props.options.name || '数据分布',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['60%', '50%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 6,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 20,
                fontWeight: 'bold',
                color: '#1C1C1E'
              },
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            labelLine: {
              show: false
            },
            data: props.data.map((item, index) => ({
              ...item,
              itemStyle: {
                color: props.options.colors?.[index] || 
                       ['#007AFF', '#34C759', '#FF9500', '#5856D6', '#FF3B30'][index % 5]
              }
            }))
          }
        ],
        animation: true,
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay: () => Math.random() * 200
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
