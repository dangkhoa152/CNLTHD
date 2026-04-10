import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore()

  if (auth.user && auth.user.role !== 'admin') {
    return navigateTo('/') 
  }
})