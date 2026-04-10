export default defineNuxtRouteMiddleware((to) => {
  const user = useCookie('hr_user')

  if (!user.value && to.path !== '/login') {
    return navigateTo('/login')
  }
  
  if (user.value && to.path === '/login') {
    return navigateTo('/')
  }
})