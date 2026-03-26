<template>
  <header class="sticky top-0 z-20 h-16 bg-white/90 dark:bg-gray-900/90 backdrop-blur border-b border-gray-200 dark:border-gray-800 px-4 md:px-6">
    <div class="h-full flex items-center justify-between">
      <div class="flex items-center gap-3">
        <button
          class="md:hidden rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2"
          @click="$emit('toggle-sidebar')"
        >
          ☰
        </button>

        <div>
          <h2 class="text-lg font-semibold">Dashboard</h2>
          <p class="text-xs text-gray-500 dark:text-gray-400">Hệ thống quản lý nhân sự</p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <ThemeToggle />

        <div class="hidden sm:flex items-center gap-2">
          <div class="text-sm">
            <p class="font-medium">{{ auth.user?.name }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ auth.user?.role }}</p>
          </div>
        </div>

        <button
          class="rounded-lg bg-red-500 text-white px-4 py-2 text-sm hover:bg-red-600"
          @click="handleLogout"
        >
          Đăng xuất
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import ThemeToggle from '~/components/common/ThemeToggle.vue'
import { toast } from 'vue3-toastify'

const auth = useAuthStore()
const router = useRouter()

defineEmits(['toggle-sidebar'])

function handleLogout() {
  auth.logout()
  toast.success('Đăng xuất thành công')
  router.push('/login')
}
</script>