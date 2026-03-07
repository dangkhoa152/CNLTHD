<template>
  <div class="chart-card">
    <h2>Employees by Department</h2>
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script setup>
import { Chart } from 'chart.js'

const props = defineProps({
  chartData: Object
})

const chartRef = ref(null)
let chartInstance = null

function renderChart() {
  if (!chartRef.value) return
  if (!props.chartData) return

  const labels = Object.keys(props.chartData)
  const values = Object.values(props.chartData)

  if (labels.length === 0) return

  if (chartInstance) {
    chartInstance.destroy()
  }

  chartInstance = new Chart(chartRef.value, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Employees',
          data: values,
          backgroundColor: '#3b82f6'
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  })
}

watch(
  () => props.chartData,
  () => {
    renderChart()
  },
  { deep: true, immediate: true }
)
</script>

<style scoped>
.chart-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
}

.chart-card h2 {
  margin-bottom: 16px;
  color: #0f172a;
}
</style>