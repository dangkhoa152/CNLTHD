<template>
  <div class="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
    <h3 class="text-lg font-semibold mb-4">Trạng thái nhân viên</h3>

    <div class="h-[320px]">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { Bar } from 'vue-chartjs'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
)

const props = defineProps({
  labels: {
    type: Array,
    default: () => []
  },
  values: {
    type: Array,
    default: () => []
  }
})

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: 'Số nhân viên',
      data: props.values.map(v => Number(v) || 0),
      backgroundColor: '#74d09a',
      borderRadius: 8
    }
  ]
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top'
    },
    tooltip: {
      enabled: true,
      callbacks: {
        label: function (context) {
          const value = context.raw || 0
          const data = context.dataset.data || []
          const total = data.reduce((sum, item) => sum + item, 0)
          const percent = total ? ((value / total) * 100).toFixed(1) : 0

          return `${value} nhân viên (${percent}%)`
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        precision: 0
      }
    }
  }
}))
</script>