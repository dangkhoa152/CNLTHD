<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-950">
    <AppSidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />

    <div class="md:pl-64">
      <AppHeader @toggle-sidebar="sidebarOpen = !sidebarOpen" />
      <main class="p-4 md:p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import AppHeader from '~/components/layout/AppHeader.vue'
import AppSidebar from '~/components/layout/AppSidebar.vue'

const sidebarOpen = ref(false)
</script>