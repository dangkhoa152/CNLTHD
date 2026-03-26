<script setup>
import { ref, onMounted } from 'vue' // Đã thêm ref
import { useRouter } from 'vue-router'
import { useDepartmentStore } from '@/stores/departmentStore'
import DepartmentModal from '@/components/departments/DepartmentModal.vue' // Đã thêm import Modal

// 1. Khởi tạo Store
const departmentStore = useDepartmentStore()
const router = useRouter()

// 2. Gọi hàm lấy dữ liệu ngay khi trang vừa render xong
onMounted(() => {
  departmentStore.fetchDepartments()
})

// 3. Hàm tiện ích: Format tiền tệ VNĐ cho cột Ngân sách
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND' 
  }).format(value)
}

// Hàm xử lý khi bấm nút "Xem"
const viewEmployees = (department) => {
  router.push({ path: '/employees', query: { department: department } })
}

// === QUẢN LÝ MODAL TỪ TRANG CHÍNH ===
const isModalOpen = ref(false)
const selectedDept = ref(null)
const availableEmployees = ref([])

const openEditModal = async (dep) => {
  selectedDept.value = dep
  
  // Lấy nhân viên cùng phòng ban
  try {
    const allEmployees = await $fetch('/data/employees.json')
    availableEmployees.value = allEmployees.filter(emp => {
      const currentDeptId = emp.history?.[0]?.departmentId
      return currentDeptId === dep.id
    })
  } catch (error) {
    console.error('Lỗi lấy nhân viên:', error)
  }

  isModalOpen.value = true
}

// HÀM MỞ MODAL THÊM MỚI
const openCreateModal = () => {
  selectedDept.value = null 
  availableEmployees.value = []
  isModalOpen.value = true
}

// HÀM LƯU (XỬ LÝ CẢ THÊM VÀ SỬA)
const handleSaveDepartment = (formData) => {
  if (formData.id) {
    departmentStore.updateDepartment(formData)
    alert('Cập nhật thành công!')
  } else {
    departmentStore.addDepartment(formData)
    alert('Thêm phòng ban mới thành công!')
  }
  isModalOpen.value = false 
}

// Hàm xử lý Xóa phòng ban có kiểm tra ràng buộc
const confirmDelete = async (dep) => {
  try {
    const allEmployees = await $fetch('/data/employees.json')
    const employeesInDept = allEmployees.filter(emp => {
      const currentDeptId = emp.history?.[0]?.departmentId
      return currentDeptId === dep.id
    })
    if (employeesInDept.length > 0) {
      alert(`⛔ KHÔNG THỂ XÓA!\n[${dep.name}] đang có ${employeesInDept.length} nhân sự.\nVui lòng chuyển các nhân sự này sang phòng khác trước khi xóa.`)
      return 
    }

    const isConfirmed = confirm(`⚠️ Bạn có chắc chắn muốn xóa phòng ban: ${dep.name}?\nHành động này không thể hoàn tác!`)
    
    if (isConfirmed) {
      departmentStore.deleteDepartment(dep.id)
      
      alert(`✅ Đã xóa thành công phòng ban: ${dep.name}`)
    }
  } catch (error) {
    console.error('Lỗi khi kiểm tra dữ liệu xóa:', error)
  }
}

</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Danh sách phòng ban</h2>
      
      <div class="relative">
        <input 
          v-model="departmentStore.searchQuery"
          type="text" 
          placeholder="Tìm tên, mã, trưởng phòng..." 
          class="pl-10 pr-4 py-2.5 text-base border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white min-w-[300px]"
        />
        <svg class="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>

        <button 
          @click="openCreateModal" 
          class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold shadow-sm transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          Thêm Mới
        </button>

      </div>
    </div>

    <div v-if="departmentStore.isLoading" class="text-center py-10">
      <p class="text-lg text-gray-500 font-medium">Đang tải dữ liệu...</p>
    </div>

    <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <table class="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
        <thead class="bg-gray-100 dark:bg-gray-900 border-b-2 border-gray-300 dark:border-gray-600">
          <tr>
            <th class="px-6 py-4 text-left text-sm font-bold text-black dark:text-white uppercase tracking-wider">Mã Phòng</th>
            <th class="px-6 py-4 text-left text-sm font-bold text-black dark:text-white uppercase tracking-wider">Tên Phòng Ban</th>
            <th class="px-6 py-4 text-left text-sm font-bold text-black dark:text-white uppercase tracking-wider">Trưởng Phòng</th>
            <th class="px-6 py-4 text-center text-sm font-bold text-black dark:text-white uppercase tracking-wider">Số Nhân Sự</th>
            <th class="px-6 py-4 text-right text-sm font-bold text-black dark:text-white uppercase tracking-wider">Ngân Sách</th>
            <th class="px-6 py-4 text-center text-sm font-bold text-black dark:text-white uppercase tracking-wider">Thao Tác</th>
          </tr>
        </thead>
        
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="dep in departmentStore.filteredDepartments" :key="dep.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            
            <td class="px-6 py-5 whitespace-nowrap text-base font-bold text-gray-900 dark:text-white">
              {{ dep.id }}
            </td>
            
            <td class="px-6 py-5 whitespace-nowrap text-base text-gray-800 dark:text-gray-200">
              <div class="font-bold text-gray-900 dark:text-white">{{ dep.name }}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ dep.description }}</div>
            </td>
            
            <td class="px-6 py-5 whitespace-nowrap text-base text-gray-800 dark:text-gray-200">
              {{ dep.employeeName - dep.employeeID || 'Chưa bổ nhiệm' }} 
            </td>
            
            <td class="px-6 py-5 whitespace-nowrap text-center text-base">
              <span class="px-3 py-1 inline-flex text-sm font-bold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {{ dep.totalEmployee }}
              </span>
            </td>
            
            <td class="px-6 py-5 whitespace-nowrap text-right text-base text-gray-800 dark:text-gray-200 font-mono font-medium">
              {{ formatCurrency(dep.budget) }}
            </td>
            
            <td class="px-6 py-5 whitespace-nowrap text-center text-base font-medium">
              <button @click="viewEmployees(dep.name)" class="text-emerald-600 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-300 mr-4 font-bold transition-colors">Xem</button>
              <button @click="openEditModal(dep)" class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4 font-bold transition-colors">Sửa</button>
              <button @click="confirmDelete(dep)" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 font-bold transition-colors">Xóa</button>
            </td>
            
          </tr>

          <tr v-if="departmentStore.filteredDepartments.length === 0">
            <td colspan="6" class="px-6 py-10 text-center text-lg text-gray-500 dark:text-gray-400">
              Không tìm thấy phòng ban nào phù hợp với từ khóa: <strong>"{{ departmentStore.searchQuery }}"</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <DepartmentModal 
      :is-open="isModalOpen"
      :department-data="selectedDept"
      :employees-list="availableEmployees"
      @close="isModalOpen = false"
      @save="handleSaveDepartment"
    />
  </div>
</template>