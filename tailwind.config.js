<<<<<<< HEAD
module.exports = {
  darkMode: 'class', // Bật tính năng Dark Mode bằng class CSS
  // ... các cấu hình khác
=======
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{js,vue}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue'
  ],
  darkMode: 'class',
  theme: {
    extend: {}
  },
  plugins: []
>>>>>>> e5d236f68a78a2662329d4cc0879742d1fb8fc1f
}