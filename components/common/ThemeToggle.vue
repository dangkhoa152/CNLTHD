<template>
  <button
    class="rounded-xl border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition"
    @click="handleToggle"
  >
    {{ theme.currentTheme === 'dark' ? '☀ Light Mode' : '🌙 Dark Mode' }}
  </button>
</template>

<script setup>
import { toast } from 'vue3-toastify'

const theme = useThemeStore()

function handleToggle() {
  theme.toggleTheme()

  setTimeout(() => {
    toast.info(
      theme.currentTheme === 'dark'
        ? 'Đã chuyển sang Dark Mode'
        : 'Đã chuyển sang Light Mode'
    )
  }, 50)
}
</script>