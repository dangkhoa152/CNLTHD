<template>
  <div :class="[
    'rounded-2xl border p-5 shadow-sm hover:shadow-md transition duration-300',
    'bg-white dark:bg-gray-900',
    'border-gray-200 dark:border-gray-800'
  ]">
    <p class="text-sm text-gray-500 dark:text-gray-400">{{ title }}</p>
    
    <!-- Áp dụng màu động cho giá trị chính -->
    <h3 :class="['mt-2 text-2xl font-bold', colorClass]">
      {{ value }}
    </h3>
    
    <p class="mt-2 text-xs text-gray-400">{{ subtitle }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: String,
  value: [Number, String],
  subtitle: String,
  color: {
    type: String,
    default: 'default'
  }
})

// Bảng màu hỗ trợ
const colorMap = {
  default: 'text-gray-900 dark:text-white',
  blue: 'text-blue-600 dark:text-blue-400',
  green: 'text-green-600 dark:text-green-400',
  red: 'text-red-600 dark:text-red-400',
  yellow: 'text-yellow-600 dark:text-yellow-400',
}

const colorClass = computed(() => colorMap[props.color] || colorMap.default)
</script>
