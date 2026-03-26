<template>
  <div class="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg p-8">
    <div class="text-center mb-8">
      <h1 class="text-2xl font-bold">HRM Login</h1>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
        Đăng nhập vào hệ thống quản lý nhân sự
      </p>
    </div>

    <form class="space-y-5" @submit.prevent="handleLogin">
      <div>
        <label class="block text-sm font-medium mb-2">Email</label>
        <input
          v-model="email"
          type="email"
          placeholder="admin@company.com"
          class="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-2">Password</label>
        <input
          v-model="password"
          type="password"
          placeholder="123456"
          class="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        class="w-full rounded-xl bg-blue-600 text-white py-3 font-medium hover:bg-blue-700"
      >
        Đăng nhập
      </button>
    </form>

    <div class="mt-6 text-sm text-gray-500 dark:text-gray-400">
      <p>Tài khoản mẫu:</p>
      <p>Email: admin@company.com</p>
      <p>Password: 123456</p>
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

  dashboard.addActivity({
    type: 'login',
    title: 'Đăng nhập hệ thống',
    user: userName
  })

  activityStore.logActivity(
    'login', 
    'Đăng nhập hệ thống', 
    'Hệ thống', 
    userName
  )

  toast.success(result.message)
  await navigateTo('/')
}
</script>