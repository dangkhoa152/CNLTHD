<template>
  <header class="sticky top-0 z-20 h-16 bg-white/95 dark:bg-slate-950/95 backdrop-blur border-b border-gray-200 dark:border-gray-800 px-4 md:px-6">
    <div class="h-full flex items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <button
          class="md:hidden rounded-xl border border-gray-300 dark:border-gray-700 p-2 transition hover:border-blue-500"
          @click="$emit('toggle-sidebar')"
          aria-label="Mở menu"
        >
          <svg class="w-5 h-5 text-slate-700 dark:text-slate-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div>
          <p class="text-[11px] font-semibold uppercase tracking-[0.35em] text-blue-600 dark:text-blue-400">Quản lý nhân sự</p>
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white">{{ currentPageTitle }}</h2>
          <!-- <p class="text-xs text-gray-500 dark:text-gray-400">{{ currentPageSubtitle }}</p> -->
        </div>
      </div>

      <div class="flex items-center gap-3">
        <ThemeToggle />

        <div class="hidden sm:flex items-center gap-3 rounded-full border border-gray-200 dark:border-gray-800 bg-slate-50 dark:bg-slate-900 px-3 py-2">
          <div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
            {{ initials }}
          </div>
          <div class="text-sm">
            <p class="font-medium text-slate-900 dark:text-white">{{ auth.user?.name }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ auth.user?.role }}</p>
          </div>
        </div>

        <button
          class="rounded-full bg-red-600 text-white px-4 py-2 text-sm font-semibold hover:bg-red-700 transition"
          @click="handleLogout"
        >
          Đăng xuất
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import ThemeToggle from '~/components/common/ThemeToggle.vue'
import { toast } from 'vue3-toastify'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const pageTitleMap = {
  '/': 'Dashboard',
  '/employees': 'Nhân sự',
  '/employees/[id]': 'Thông tin nhân sự',
  '/departments': 'Phòng ban',
  '/leave-requests': 'Nghỉ phép',
  '/leave-requests/calendar': 'Lịch nghỉ phép',
  '/activities': 'Lịch sử hoạt động'
}

const currentPageTitle = computed(() => {
  const path = route.path
  if (path.startsWith('/employees')) return 'Quản lý nhân sự'
  if (path.startsWith('/departments')) return 'Phòng ban'
  if (path.startsWith('/leave-requests')) return path === '/leave-requests/calendar' ? 'Lịch nghỉ phép' : 'Nghỉ phép'
  if (path.startsWith('/activities')) return 'Lịch sử hoạt động'
  return pageTitleMap[path] || 'Quản lý hệ thống'
})
// const currentPageSubtitle = computed(() => `Chào mừng ${auth.user?.name || 'Admin'} đến với HRM Dashboard`)
const initials = computed(() => {
  const name = auth.user?.name || 'HR'
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
})

defineEmits(['toggle-sidebar'])

function handleLogout() {
  auth.logout()
  toast.success('Đăng xuất thành công')
  router.push('/login')
}
</script>