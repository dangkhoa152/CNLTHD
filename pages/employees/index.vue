<script setup lang="ts">
// Nuxt Auto-imports: Không cần import useEmployeeStore, onMounted, ref...

const employeeStore = useEmployeeStore()

// Vue Lifecycle: Khi component được gắn vào DOM, tiến hành kéo dữ liệu
onMounted(() => {
  // Chỉ kéo dữ liệu nếu mảng đang rỗng (tránh gọi lại nhiều lần khi chuyển tab)
  if (employeeStore.employees.length === 0) {
    employeeStore.fetchEmployees()
  }
})

// Cách dùng chế độ Dark Mode
const colorMode = useColorMode()
const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <div class="bg-white dark:bg-slate-900 text-slate-800 dark:text-white p-6 rounded-xl transition-colors">
    <button @click="toggleTheme" class="mb-4 p-2 border rounded">Đổi Theme</button>
    
    <input v-model="employeeStore.searchQuery" placeholder="Tìm nhân viên..." class="border p-2 dark:bg-slate-800" />
    
    <div v-if="employeeStore.isLoading">Đang tải...</div>
    <table v-else>
      <tr v-for="emp in employeeStore.processedEmployees" :key="emp.id">
        <td>{{ emp.personalInfo.fullName }}</td>
      </tr>
    </table>
  </div>
</template>