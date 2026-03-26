<template>
  <div class="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
    <h3 class="text-lg font-semibold mb-4">Hoạt động gần đây</h3>

    <div class="space-y-4">
      <div
        v-for="item in activities.slice(0, 6)"
        :key="item.id"
        class="flex gap-3"
      >
        <div
          class="mt-1 h-3 w-3 rounded-full shrink-0"
          :class="dotClass(item.type)"
        />
        <div>
          <p class="text-sm font-semibold">{{ item.title }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            bởi {{ item.user }}
            <span v-if="item.target">• {{ item.target }}</span>
          </p>
          <p class="text-xs text-gray-400 mt-1">{{ item.time }}</p>
        </div>
      </div>

      <div
        v-if="activities.length === 0"
        class="text-sm text-gray-500 dark:text-gray-400"
      >
        Chưa có hoạt động nào.
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

function dotClass(type) {
  switch (type) {
    case 'add':
      return 'bg-emerald-500'
    case 'edit':
      return 'bg-blue-500'
    case 'delete':
      return 'bg-red-500'
    case 'login':
      return 'bg-purple-500'
    case 'theme':
      return 'bg-gray-500'
    default:
      return 'bg-sky-500'
  }
}
</script>