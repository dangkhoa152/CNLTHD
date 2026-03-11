export const useThemeStore = defineStore('theme', () => {
  const colorMode = useColorMode()

  const currentTheme = computed(() => colorMode.value)

  function toggleTheme() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }

  return {
    currentTheme,
    toggleTheme
  }
})