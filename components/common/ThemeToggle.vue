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
const dashboard = useDashboardStore()
const auth = useAuthStore()

function handleToggle() {
  const isDarkBefore = theme.currentTheme === 'dark'
  theme.toggleTheme()

  setTimeout(() => {
    const title = isDarkBefore ? 'Chuyển sang Light Mode' : 'Chuyển sang Dark Mode'

    dashboard.addActivity({
      type: 'theme',
      title,
      user: auth.user?.name || 'Admin HR'
    })

    toast.info(`Đã cập nhật giao diện`)
  }, 50)
}
</script>