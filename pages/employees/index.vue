<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePagination } from '~/composables/usePagination'

// dữ liệu nhân viên
const employees = ref([])
const searchQuery = ref('')
const route = useRoute()

// load dữ liệu khi mở trang
onMounted(async () => {
  try {
    const data = await $fetch('/data/employees.json')
    employees.value = data
  } catch (error) {
    console.error('Lỗi tải nhân viên:', error)
  }
})

// lọc theo phòng ban từ query (?dept=IT)
const deptFilter = computed(() => route.query.dept)

const openCreateEmployee = (emp) => {
  alert('Chức năng thêm mới sẽ được triển khai sau!')
}

const openEditEmployee = (emp) => {
  alert(`Chức năng sửa sẽ được triển khai sau! (ID: ${emp.id})`)
}

const confirmDelete = (emp) => {
  if (confirm(`Bạn có chắc muốn xóa nhân viên ${emp.name} không?`)) {
    alert('Chức năng xóa sẽ được triển khai sau!')
  }
}

// lọc theo phòng ban + search
const filteredEmployees = computed(() => {
  let list = employees.value

  // lọc phòng ban
  if (deptFilter.value) {
    list = list.filter(emp => emp.departmentId === deptFilter.value)
  }

  // search
  if (searchQuery.value.trim()) {
    const keyword = searchQuery.value.toLowerCase()

    list = list.filter(emp =>
      (emp.name && emp.name.toLowerCase().includes(keyword)) ||
      (emp.employeeCode && emp.employeeCode.toLowerCase().includes(keyword)) ||
      (emp.id && emp.id.toLowerCase().includes(keyword))
    )
  }

  return list
})

  const {
    currentPage,
    totalPages,
    paginatedList,
    nextPage,
    prevPage,
    goToPage
  } = usePagination(filteredEmployees, 10)

  const visiblePages = computed(() => {
    const pages = []
    const total = totalPages.value
    const current = currentPage.value

    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1)
    }

    pages.push(1)

    if (current > 3) {
      pages.push('...')
    }

    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (current < total - 2) {
      pages.push('...')
    }

    pages.push(total)

    return pages
  })
</script>

<template>
<div class="p-6">

  <div class="flex justify-between items-center mb-6">
    <h2 class="text-2xl font-bold text-gray-800 dark:text-white">
      Trang quản lý nhân viên
    </h2>

    <div class="relative">
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Tìm tên, mã nhân viên..." 
          class="pl-10 pr-4 py-2.5 text-base border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white min-w-[300px]"
        />
        <svg class="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>

        <button 
          @click="openCreateEmployee(employees)" 
          class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white my-[5px] px-3 py-3 rounded-lg font-bold shadow-sm transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          Thêm Mới
        </button>

      </div>
  </div>

  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">

    <table class="min-w-full divide-y divide-gray-300 dark:divide-gray-700">

      <thead class="bg-gray-100 dark:bg-gray-900">
        <tr>
          <th class="sticky left-0 z-10 bg-gray-200 w-[60px] px-5 py-4 text-center">ID</th>
          <th class="sticky left-[60px] z-10 bg-gray-200 w-[140px] px-6 py-4 text-center">Mã nhân viên</th>
          <th class="sticky left-[200px] z-10 bg-gray-200 w-[200px] px-6 py-4 text-center">Tên</th>
          <th class="whitespace-nowrap px-6 py-4 text-center">Giới tính</th>
          <th class="whitespace-nowrap  px-6 py-4 text-center">Ngày sinh</th>
          <th class="px-6 py-4 text-left">Email</th>
          <th class="px-6 py-4 text-center">Số điện thoại</th>
          <th class="px-6 py-4 text-center">Địa chỉ</th>
          <th class="whitespace-nowrap px-6 py-4 text-center">Id phòng ban</th>
          <th class="px-6 py-4 text-center">Phòng ban</th>
          <th class="px-6 py-4 text-center">Chức vụ</th>
          <th class="whitespace-nowrap px-6 py-4 text-center">Trạng thái</th>
          <th class="whitespace-nowrap px-6 py-4 text-center">Ngày vào làm</th>
          <th class="px-6 py-4 text-center">Avatar</th>
          <th class="px-6 py-4 text-center">Thao tác</th>
        </tr>
      </thead>

      <tbody>

        <tr
          v-for="emp in paginatedList"
          :key="emp.id"
          class="hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <td class="sticky left-0 bg-white w-[60px] px-6 py-4 text-center">{{ emp.id }}</td>
          <td class="sticky left-[60px] bg-white w-[140px] px-10 py-4 text-left font-bold">{{ emp.employeeCode }}</td>
          <td class="sticky left-[200px] bg-white w-[200px] px-6 py-4 whitespace-nowrap text-center">{{ emp.name }}</td>
          <td class="px-6 py-4 text-center">{{emp.gender }}</td>
          <td class="px-10 py-4 whitespace-nowrap">{{emp.dateOfBirth}}</td>
          <td class="px-6 py-4">{{emp.email}}</td>
          <td class="px-10 py-4">{{emp.phone }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-center">{{emp.address}}</td>
          <td class="px-10 py-4">{{emp.departmentId}}</td>
          <td class="whitespace-nowrap px-10 py-4 text-center">{{emp.department}}</td>
          <td class="whitespace-nowrap px-6 py-4 text-center">{{emp.position}}</td>
          <td class="whitespace-nowrap px-10 py-4">{{emp.status}}</td>
          <td class="whitespace-nowrap px-10 py-4">{{emp.joinDate}}</td>
          <td class="px-6 py-4">{{emp.avatar}}</td>
          <td class="whitespace-nowrap px-6 py-4 text-center">
            <button @click="openEditEmployee(emp)" class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mx-2 mr-4 font-bold transition-colors">Sửa</button>
            <button @click="confirmDelete(emp)" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 font-bold transition-colors">Xóa</button>
          </td>
        </tr>

        <tr v-if="paginatedList.length === 0">
          <td colspan="5" class="text-center py-8 text-gray-500">
            Không tìm thấy nhân viên
          </td>
        </tr>

      </tbody>

    </table>

  </div>
  <div class="flex justify-center mt-4 gap-2 items-center">

  <!-- Prev -->
  <button
    @click="prevPage"
    :disabled="currentPage === 1"
    class="px-3 py-1 border rounded disabled:opacity-50"
  >
    ←
  </button>

  <!-- Pages -->
  <button
    v-for="(page, index) in visiblePages"
    :key="index"
    @click="typeof page === 'number' && goToPage(page)"
    :disabled="page === '...'"
    :class="[
      'px-3 py-1 border rounded',
      page === currentPage ? 'bg-blue-500 text-white' : '',
      page === '...' ? 'cursor-default border-none' : ''
    ]"
  >
    {{ page }}
  </button>

  <!-- Next -->
  <button
    @click="nextPage"
    :disabled="currentPage === totalPages"
    class="px-3 py-1 border rounded disabled:opacity-50"
  >
    →
  </button>

</div>

</div>
</template>