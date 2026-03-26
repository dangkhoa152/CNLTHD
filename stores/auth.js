export const useAuthStore = defineStore('auth', () => {
  const userCookie = useCookie('hr_user', {
    default: () => null
  })

  const user = ref(userCookie.value)
  const isAuthenticated = computed(() => !!user.value)

  async function login(email, password) {
    const users = await $fetch('/data/users.json')

    const foundUser = users.find(
      item => item.email === email && item.password === password
    )

    if (!foundUser) {
      return {
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      }
    }

    const safeUser = {
      id: foundUser.id,
      email: foundUser.email,
      name: foundUser.name,
      role: foundUser.role,
      avatar: foundUser.avatar
    }

    user.value = safeUser
    userCookie.value = safeUser

    return {
      success: true,
      message: 'Đăng nhập thành công'
    }
  }

  function logout() {
    user.value = null
    userCookie.value = null

    if (process.client) {
      localStorage.removeItem('hr_activities')
      localStorage.removeItem('hrm_activities')
    }
    navigateTo('/login')
  }
  return {
    user,
    isAuthenticated,
    login,
    logout
  }
})