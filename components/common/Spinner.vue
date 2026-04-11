<template>
  <div :class="['inline-flex', sizeClass]">
    <div :class="['animate-spin rounded-full border-2 border-gray-300 dark:border-gray-600', borderColorClass, sizeClass]"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['xs', 'sm', 'md', 'lg'].includes(v)
  },
  color: {
    type: String,
    default: 'blue'
  }
})

const sizeClass = computed(() => {
  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }
  return sizes[props.size] || sizes.md
})

const borderColorClass = computed(() => {
  if (props.color === 'currentColor') {
    return 'border-t-current'
  }
  const colors = {
    blue: 'border-t-blue-500 dark:border-t-blue-400',
    emerald: 'border-t-emerald-500 dark:border-t-emerald-400',
    red: 'border-t-red-500 dark:border-t-red-400',
    yellow: 'border-t-yellow-500 dark:border-t-yellow-400'
  }
  return colors[props.color] || colors.blue
})
</script>
