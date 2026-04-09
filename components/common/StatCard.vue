<template>
  <div :class="[
    'rounded-[1.5rem] border p-5 shadow-sm hover:shadow-md transition duration-300 min-h-[112px]',
    'bg-white dark:bg-slate-950',
    'border-gray-200 dark:border-slate-800']">
    <p class="text-sm font-semibold text-slate-500 dark:text-slate-400 tracking-[0.03em]">{{ title }}</p>
    <h3 :class="['mt-2 text-3xl font-bold', colorClass]">{{ value }}</h3>
    <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">{{ subtitle }}</p>
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
