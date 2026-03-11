<template>
  <div class="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 shadow-sm hover:shadow-md transition duration-300">
    <p class="text-sm text-gray-500 dark:text-gray-400">{{ title }}</p>
    <h3 class="mt-2 text-3xl font-bold">{{ value }}</h3>
    <p class="mt-2 text-xs text-gray-400">{{ subtitle }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: [Number, String],
  subtitle: String
})
</script>