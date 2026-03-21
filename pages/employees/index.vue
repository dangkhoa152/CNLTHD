<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePagination } from '~/composables/usePagination'

// dữ liệu nhân viên
const employees = ref([])
const searchQuery = ref('')
const route = useRoute()
const showCreateModal = ref(false)
const showEditModal = ref(false)

// hàm lưu vào localStorage
const saveToLocal = () => {
  localStorage.setItem('employees', JSON.stringify(employees.value))
}

const formEmployee = ref({
  id: '',
  employeeCode: '',
  name: '',
  gender: '',
  dateOfBirth: '',
  email: '',
  phone: '',
  address: '',
  departmentId: '',
  department: '',
  position: '',
  status: '',
  joinDate: '',
  avatar: ''
})

// load dữ liệu khi mở trang
onMounted(async () => {
  try {
    const saved = localStorage.getItem('employees')

    if (saved) {
      //nếu đã có dữ liệu lưu → dùng luôn
      employees.value = JSON.parse(saved)
    } else {
      //chưa có → load từ JSON
      const data = await $fetch('/data/employees.json')
      employees.value = data

      //lưu lần đầu
      localStorage.setItem('employees', JSON.stringify(data))
    }
  } catch (error) {
    console.error('Lỗi tải nhân viên:', error)
  }
})

// Tìm kiếm nhân viên với tất cả dữ liệu
const filteredEmployees = computed(() => {
  if (!searchQuery.value) {
    return employees.value
  }
  const query = searchQuery.value.toLowerCase()
  return employees.value.filter (emp => 
    String(emp.id).toLowerCase().includes(query) ||
    String(emp.employeeCode).toLowerCase().includes(query) ||
    String(emp.name).toLowerCase().includes(query) ||
    String(emp.department).toLowerCase().includes(query) ||
    String(emp.departmentId).toLowerCase().includes(query) ||
    String(emp.gender).toLowerCase().includes(query) ||
    String(emp.position).toLowerCase().includes(query) ||
    String(emp.email).toLowerCase().includes(query) ||
    String(emp.phone).toLowerCase().includes(query) ||
    String(emp.address).toLowerCase().includes(query) ||
    String(emp.status).toLowerCase().includes(query) ||
    String(emp.joinDate).toLowerCase().includes(query) ||
    String(emp.dateOfBirth).toLowerCase().includes(query)
  )
})

// hàm lưu đồng thời khi thêm mới hoặc sửa nhân viên sẽ tự động lưu vào localStorage
const editingId = ref(null)

const saveEmployee = () => {
  const emp = { ...formEmployee.value }

  const error = validateEmployee(emp, employees.value, editingId.value)
  if (error) {
    alert(error)
    return
  }

  if (editingId.value) {
    // EDIT
    const index = employees.value.findIndex(e => e.id === editingId.value)
    if (index !== -1) {
      employees.value.splice(index, 1, emp)
    }
  } else {
    // CREATE
    employees.value.push(emp)
  }

  employees.value = [...employees.value] // đảm bảo re-render
  saveToLocal()

  closeCreateEmployee()
  closeEditEmployee()
  editingId.value = null
}

//hàm kiểm tra dữ liệu hợp lệ trước khi thêm mới hoặc sửa nhân viên
const validateEmployee = (emp, list, editingId = null) => {
  if (!emp.id?.toString().trim()) return 'Thiếu ID'
  if (!emp.employeeCode?.trim()) return 'Thiếu mã NV'
  if (!emp.name?.trim()) return 'Thiếu tên'

  const id = String(emp.id).trim()
  const code = emp.employeeCode.trim().toLowerCase()

  const idExists = list.some(e =>
    String(e.id) === id && String(e.id) !== String(editingId)
  )
  if (idExists) return 'ID đã tồn tại'

  const codeExists = list.some(e =>
    e.employeeCode?.toLowerCase() === code &&
    String(e.id) !== String(editingId)
  )
  if (codeExists) return 'Mã NV đã tồn tại'

  return null
}

// mở modal thêm mới
const openCreateEmployee = (emp) => {
  showEditModal.value = false
  formEmployee.value = {...emp}
  showCreateModal.value = true
}

// đóng modal thêm mới
const closeCreateEmployee = () => {
  showCreateModal.value = false
}

// mở modal sửa
const openEditEmployee = (emp) => {
  showCreateModal.value = false
  formEmployee.value = {...emp}
  editingId.value = emp.id 
  showEditModal.value = true
}
// đóng modal sửa
const closeEditEmployee = () => {
  showEditModal.value = false
}

// xác nhận xóa
const confirmDelete = (emp) => {
  if (confirm(`Bạn có chắc muốn xóa nhân viên ${emp.name} không?`)) {
    employees.value = employees.value.filter(e => e.id !== emp.id)
    saveToLocal()
  }
}

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
          @click="openCreateEmployee" 
          class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white my-[7px] px-3 py-3 rounded-lg font-bold shadow-sm transition-colors"
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
          <th class="sticky left-0 z-10 bg-gray-200 dark:bg-gray-700 w-[60px] px-5 py-4 text-center">ID</th>
          <th class="sticky left-[60px] z-10 bg-gray-200 dark:bg-gray-700 w-[140px] px-6 py-4 text-center">Mã nhân viên</th>
          <th class="sticky left-[200px] z-10 bg-gray-200 dark:bg-gray-700 w-[200px] px-6 py-4 text-center">Tên</th>
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
          <td class="sticky left-0 bg-white dark:bg-gray-800 w-[60px] px-6 py-4 text-center">{{ emp.id }}</td>
          <td class="sticky left-[60px] bg-white dark:bg-gray-800 w-[140px] px-10 py-4 text-left font-bold">{{ emp.employeeCode }}</td>
          <td class="sticky left-[200px] bg-white dark:bg-gray-800 w-[200px] px-6 py-4 whitespace-nowrap text-center">{{ emp.name }}</td>
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
  <div v-if="showCreateModal" class="fixed z-50 inset-0 bg-black/40 flex justify-center items-center">
  <div class="space-y-4 bg-white px-[20px] rounded-lg w-[800px]">
    <h2 class="font-bold text-lg text-blue-500 pt-8 pb-3">Thêm mới nhân viên </h2>
    <div class="grid grid-cols-2 gap-2">
      <div class="grid grid-cols-2 gap-2 ml-5">
        <label class="mt-3 block mb-1 font-medium">ID</label>
        <input v-model="formEmployee.id" class="border mb-2 p-2 rounded" />
        <label class="mt-3 block mb-1 font-medium">Mã nhân viên</label>
        <input v-model="formEmployee.employeeCode" class="border mb-2 p-2 rounded" />
        <label class="mt-3 block mb-1 font-medium">Tên nhân viên</label>
        <input v-model="formEmployee.name" class="border mb-2 p-2 rounded" />
        <label class="mt-3 block mb-1 font-medium">Giới tính</label>
        <input v-model="formEmployee.gender" class="border mb-2 p-2 rounded" />
        <label class="mt-3 block mb-1 font-medium">Ngày sinh</label>
        <input v-model="formEmployee.dateOfBirth" type="date" class="border mb-2 p-2 rounded" />
        <label class="mt-3 block mb-1 font-medium">Email</label>
        <input v-model="formEmployee.email" class="border mb-2 p-2 rounded" />
        <label class="mt-3 block mb-1 font-medium">Số điện thoại</label>
        <input v-model="formEmployee.phone" class="border mb-2 p-2 rounded" />
        </div>
        <div class="grid grid-cols-2 gap-2 ml-8 mr-5">
        <label class="mt-3 block mb-1 font-medium">Địa chỉ</label>
        <input v-model="formEmployee.address" class="border mb-2 p-2 rounded" />
        <label class="mt-3 block mb-1 font-medium">ID phòng ban</label>
        <input v-model="formEmployee.departmentId" class="border mb-2 p-2 rounded" />
        <label class="mt-3 block mb-1 font-medium">Phòng ban</label>
        <input v-model="formEmployee.department" class="border mb-2 p-2 rounded" />
        <label class="mt-3 block mb-1 font-medium">Chức vụ</label>
        <input v-model="formEmployee.position" class="border mb-2 p-2 rounded" />
        <label class="mt-3 block mb-1 font-medium">Trạng thái</label>
        <input v-model="formEmployee.status" class="border mb-2 p-2 rounded" />
        <label class="mt-3 block mb-1 font-medium">Ngày vào làm</label>
        <input v-model="formEmployee.joinDate" type="date" class="border mb-2 p-2 rounded" />
        <label class="mt-3 block mb-1 font-medium">Avatar URL</label>
        <input v-model="formEmployee.avatar" class="border mb-2 p-2 rounded" />
        </div>
    </div>
    <div class="flex justify-end gap-2 pt-3 pb-8">
      <button @click="closeCreateEmployee" class="border border-gray-300 text-gray-700 px-3 py-2  rounded w-[75px]">Hủy</button>
      <button @click="saveEmployee" class="bg-blue-500 text-white px-3 py-2 rounded mr-5 w-[75px]">Lưu</button>
    </div>
    </div>
  </div>
  </div>

  <div v-if="showEditModal" class="fixed z-50 inset-0 bg-black/40 flex justify-center items-center">
  <div class="space-y-4 bg-white px-[20px] rounded-lg w-[800px]">
    <h2 class="font-bold text-lg text-blue-500 pt-8 pb-3">Sửa nhân viên </h2>
    <div class="grid grid-cols-2 gap-2">
      <div class="grid grid-cols-2 gap-2 ml-5">
        <label class="mt-3 block mb-1 font-medium">ID</label>
        <input v-model="formEmployee.id" class="border mb-2 p-2 rounded" />
        <label class="mt-3 block mb-1 font-medium">Mã nhân viên</label>
        <input v-model="formEmployee.employeeCode" class="border mb-2 p-2 rounded" />
        <label class="mt-3 block mb-1 font-medium">Tên nhân viên</label>
        <input v-model="formEmployee.name" class="border mb-2 p-2 rounded" />
        <label class="mt-3 block mb-1 font-medium">Giới tính</label>
        <input v-model="formEmployee.gender" class="border mb-2 p-2 rounded" />
        <label class="mt-3 block mb-1 font-medium">Ngày sinh</label>
        <input v-model="formEmployee.dateOfBirth" type="date" class="border mb-2 p-2 rounded" />
        <label class="mt-3 block mb-1 font-medium">Email</label>
        <input v-model="formEmployee.email" class="border mb-2 p-2 rounded" />
        <label class="mt-3 block mb-1 font-medium">Số điện thoại</label>
        <input v-model="formEmployee.phone" class="border mb-2 p-2 rounded" />
      </div>
      <div class="grid grid-cols-2 gap-2 ml-8 mr-5">
        <label class="mt-3 block mb-1 font-medium">Địa chỉ</label>
        <input v-model="formEmployee.address" class="border mb-2 p-2 rounded" />
        <label class="mt-3 block mb-1 font-medium">ID phòng ban</label>
        <input v-model="formEmployee.departmentId" class="border mb-2 p-2 rounded" />
        <label class="mt-3 block mb-1 font-medium">Phòng ban</label>
        <input v-model="formEmployee.department" class="border mb-2 p-2 rounded" />
        <label class="mt-3 block mb-1 font-medium">Chức vụ</label>
        <input v-model="formEmployee.position" class="border mb-2 p-2 rounded" />
        <label class="mt-3 block mb-1 font-medium">Trạng thái</label>
        <input v-model="formEmployee.status" class="border mb-2 p-2 rounded" />
        <label class="mt-3 block mb-1 font-medium">Ngày vào làm</label>
        <input v-model="formEmployee.joinDate" type="date" class="border mb-2 p-2 rounded" />
        <label class="mt-3 block mb-1 font-medium">Avatar URL</label>
        <input v-model="formEmployee.avatar" class="border mb-2 p-2 rounded" />
      </div>
    </div>
    <div class="flex justify-end gap-2 pt-3 pb-8">
      <button @click="closeEditEmployee" class="border border-gray-300 text-gray-700 px-3 py-2  rounded w-[75px]">Hủy</button>
      <button @click="saveEmployee" class="bg-blue-500 text-white px-3 py-2 rounded mr-5 w-[75px]">Lưu</button>
    </div>
    </div>
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
</template>