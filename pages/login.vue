<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-4 py-10">
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),_transparent_35%)] pointer-events-none" />
    <div class="relative w-full max-w-3xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/95 shadow-2xl backdrop-blur-lg dark:bg-slate-950/95">
      <div class="grid grid-cols-1 lg:grid-cols-[1.3fr_0.9fr]">
        <div class="p-10 lg:p-12">
          <div class="mb-8 space-y-3">
            <div class="inline-flex items-center justify-center rounded-full bg-blue-600 text-white w-12 h-12 text-lg font-bold shadow-lg">HR</div>
            <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Xin chào trở lại</h1>
            <p class="text-sm text-slate-500 dark:text-slate-400">Đăng nhập để tiếp tục quản lý nhân sự, phòng ban và đơn nghỉ phép trong một giao diện chuyên nghiệp.</p>
          </div>

          <form class="space-y-5" @submit.prevent="handleLogin">
            <div>
              <label class="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-200">Email</label>
              <input
                v-model="email"
                type="email"
                placeholder="admin@company.com"
                class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-200">Password</label>
              <input
                v-model="password"
                type="password"
                placeholder="123456"
                class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              class="w-full rounded-2xl bg-blue-600 text-white py-3 font-semibold shadow-lg transition hover:bg-blue-700"
            >
              Đăng nhập
            </button>
          </form>

          <div class="mt-8 rounded-3xl bg-slate-100 p-4 text-sm text-slate-600 dark:bg-slate-900 dark:text-slate-300">
            <p class="font-semibold mb-2">Tài khoản mẫu</p>
            <p>Email: <span class="font-medium">admin@company.com</span></p>
            <p>Password: <span class="font-medium">123456</span></p>
          </div>
        </div>

        <div class="hidden lg:flex flex-col justify-center gap-6 bg-blue-600 px-10 py-12 text-white">
          <div>
            <p class="text-xs uppercase tracking-[0.3em] text-blue-200">Bảng quản trị</p>
            <h2 class="mt-4 text-2xl font-bold">HRM Dashboard</h2>
          </div>
          <p class="text-sm leading-6 text-blue-100">Kết nối dữ liệu nhân sự, đơn nghỉ phép và phòng ban trong một nơi. Giao diện thân thiện, dễ thao tác và trực quan.</p>
          <div class="grid gap-4">
            <div class="rounded-3xl bg-white/10 p-4">
              <p class="text-xs uppercase tracking-[0.25em] text-blue-100">Nhanh chóng</p>
              <p class="mt-2 text-base font-semibold">Đăng nhập chỉ trong vài giây</p>
            </div>
            <div class="rounded-3xl bg-white/10 p-4">
              <p class="text-xs uppercase tracking-[0.25em] text-blue-100">Trực quan</p>
              <p class="mt-2 text-base font-semibold">Dữ liệu hiển thị rõ ràng, dễ thao tác</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { toast } from 'vue3-toastify'

definePageMeta({
  layout: 'auth',
  middleware: ['auth']
})

const auth = useAuthStore()
const router = useRouter()

const email = ref('admin@company.com')
const password = ref('123456')

const dashboard = useDashboardStore()
const activityStore = useActivityStore()

const userName = auth.user?.name || 'Admin HR'


async function handleLogin() {
  const result = await auth.login(email.value, password.value)

  if (!result.success) {
    toast.error(result.message)
    return
  }

  const userName = auth.user?.name || 'Admin HR'

  await activityStore.fetchActivities()

  // 1. Lưu vào Widget Dashboard
  dashboard.addActivity({
    type: 'login',
    title: 'Đăng nhập hệ thống',
    user: userName
  })

  // 2. Lưu vào Lịch sử hoạt động tổng (Activity Store)
  activityStore.logActivity('login', 'Đăng nhập hệ thống', 'Hệ thống', userName)

  toast.success(result.message)
  await navigateTo('/')
}
</script>