<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-30 bg-black/50 md:hidden"
    @click="$emit('close')"
  />

  <aside
    class="fixed inset-y-0 left-0 z-40 w-64 transform bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-transform duration-300 md:translate-x-0 shadow-sm"
    :class="isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
  >
    <div class="h-20 px-6 flex items-center border-b border-gray-200 dark:border-gray-800">
      <div class="flex items-center gap-3">
        <div class="h-11 w-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
          HR
        </div>
        <div>
          <h1 class="text-lg font-extrabold tracking-wide text-blue-600 dark:text-blue-400 whitespace-nowrap">
            HRM Dashboard
          </h1>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            Quản lý nhân sự
          </p>
        </div>
      </div>
    </div>

    <nav class="p-4 space-y-2">
      <NuxtLink
        to="/"
        class="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition"
        :class="route.path === '/'
          ? 'bg-blue-50 text-blue-600 dark:bg-gray-800 dark:text-blue-400 shadow-sm'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'"
        @click="$emit('close')"
      >
        <span class="text-lg">📊</span>
        <span>Dashboard</span>
      </NuxtLink>

      <NuxtLink
        to="/employees"
        class="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition"
        :class="route.path === '/employees'
          ? 'bg-blue-50 text-blue-600 dark:bg-gray-800 dark:text-blue-400 shadow-sm'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'"
        @click="$emit('close')"
      >
        <span class="text-lg">👥</span>
        <span>Quản lý nhân viên</span>
      </NuxtLink>

      <NuxtLink
        to="/departments"
        class="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition"
        :class="route.path === '/departments'
          ? 'bg-blue-50 text-blue-600 dark:bg-gray-800 dark:text-blue-400 shadow-sm'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'"
        @click="$emit('close')"
      >
        <span class="text-lg">🏢</span>
        <span>Phòng ban</span>
      </NuxtLink>

      <NuxtLink
        to="/leave-requests"
        class="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition"
        :class="route.path === '/leave-requests'
          ? 'bg-blue-50 text-blue-600 dark:bg-gray-800 dark:text-blue-400 shadow-sm'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'"
        @click="$emit('close')"
      >
        <span class="text-lg">📝</span>
        <span>Nghỉ phép</span>
      </NuxtLink>

      <NuxtLink
        to="/activities"
        class="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition"
        :class="route.path === '/activities'
          ? 'bg-blue-50 text-blue-600 dark:bg-gray-800 dark:text-blue-400 shadow-sm'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'"
        @click="$emit('close')"
      >
        <span class="text-lg">🕒</span>
        <span>Lịch sử hoạt động</span>
      </NuxtLink>
    </nav>

    <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
      <div class="rounded-xl bg-gray-50 dark:bg-gray-800 px-4 py-3">
        <p class="text-xs font-semibold text-gray-700 dark:text-gray-200">
          HRM System
        </p>
        <p class="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
          Giao diện quản trị nhân sự nội bộ
        </p>
      </div>
    </div>
  </aside>
</template>

<script setup>
const route = useRoute()

defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

defineEmits(['close'])
</script>