<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center gap-2 font-semibold transition-colors duration-200',
      'rounded-lg px-4 py-2 text-sm',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
      variantClass,
      disabled || loading ? 'opacity-50 cursor-not-allowed' : ''
    ]"
    v-bind="$attrs"
  >
    <Spinner v-if="loading" size="xs" color="currentColor" />
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'
import Spinner from './Spinner.vue'

const props = defineProps({
  type: { type: String, default: 'button', validator: (v) => ['button', 'submit', 'reset'].includes(v) },
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'secondary', 'danger', 'success', 'warning', 'ghost'].includes(v)
  },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false }
})

const variantClass = computed(() => {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600',
    secondary: 'bg-gray-300 text-gray-900 hover:bg-gray-400 focus:ring-gray-500 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-700',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 dark:bg-red-700 dark:hover:bg-red-600',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 dark:bg-emerald-700 dark:hover:bg-emerald-600',
    warning: 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500 dark:bg-yellow-600 dark:hover:bg-yellow-700',
    ghost: 'bg-transparent text-gray-700 border border-gray-300 hover:bg-gray-100 focus:ring-gray-500 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-800'
  }
  return variants[props.variant] || variants.primary
})
</script>
