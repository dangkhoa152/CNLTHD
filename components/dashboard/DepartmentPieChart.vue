<template>
  <div class="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
    <h3 class="text-lg font-semibold mb-4">Tỉ lệ nhân viên theo phòng ban</h3>

    <div class="h-[320px]">
      <Pie :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'
import { Pie } from 'vue-chartjs'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

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
      backgroundColor: [
        '#60A5FA',
        '#34D399',
        '#FBBF24',
        '#F87171',
        '#A78BFA',
        '#22D3EE'
      ],
      borderColor: '#ffffff',
      borderWidth: 2
    }
  ]
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top'
    },
    tooltip: {
      enabled: true,
      callbacks: {
        label: function (context) {
          const label = context.label || ''
          const value = context.raw || 0

          const data = context.dataset.data || []
          const total = data.reduce((sum, item) => sum + item, 0)

          const percent = total ? ((value / total) * 100).toFixed(1) : 0

          return `${label}: ${value} nhân viên (${percent}%)`
        }
      }
    }
  }
}))
</script>