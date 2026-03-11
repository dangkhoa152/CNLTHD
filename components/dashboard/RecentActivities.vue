<template>
  <div class="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
    <h3 class="text-lg font-semibold mb-4">Hoạt động gần đây</h3>

    <div class="space-y-4">
      <div
        v-for="item in activities"
        :key="item.id"
        class="flex gap-3"
      >
        <div class="mt-1 h-3 w-3 rounded-full bg-blue-500 shrink-0" />
        <div>
          <p class="text-sm font-medium">{{ item.message }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">{{ item.time }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  activities: {
    type: Array,
    default: () => []
  }
})
</script>