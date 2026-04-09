<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDepartmentStore } from '@/stores/departmentStore'
import { useEmployeeStore } from '@/stores/employeeStore'
import DepartmentModal from '@/components/departments/DepartmentModal.vue'
import StatCard from '@/components/common/StatCard.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'
import FormInput from '@/components/common/FormInput.vue'

const departmentStore = useDepartmentStore()
const employeeStore = useEmployeeStore()
const router = useRouter()

onMounted(() => {
  departmentStore.fetchDepartments()
})

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value)
}

const viewEmployees = (department) => {
  router.push({ path: '/employees', query: { department: department } })
}

const isModalOpen = ref(false)
const selectedDept = ref(null)
const availableEmployees = ref([])

const isConfirmModalOpen = ref(false)
const deptToDelete = ref(null)
const idToDelete = ref(null)

const totalDepartments = computed(() => departmentStore.departments.length)
const totalBudget = computed(() => departmentStore.departments.reduce((sum, dep) => sum + Number(dep.budget || 0), 0))
const totalEmployees = computed(() => departmentStore.departments.reduce((sum, dep) => sum + Number(dep.totalEmployee || 0), 0))

const isEmployeeInDepartment = (emp, deptId) => {
  if (emp.departmentId === deptId) return true
  if (Array.isArray(emp.history)) {
    return emp.history.some(h => h.departmentId === deptId)
  }
  return false
}

const openEditModal = async (dep) => {
  selectedDept.value = dep

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

const openCreateModal = () => {
  selectedDept.value = null
  availableEmployees.value = []
  isModalOpen.value = true
}

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

const confirmDelete = async (dep) => {
  try {
    if (employeeStore.employees.length === 0) {
      await employeeStore.fetchEmployees()
    }
    
    const allEmployees = employeeStore.employees

    const employeesInDept = allEmployees.filter(emp => {
      const currentDeptId = emp.history?.[0]?.departmentId || emp.departmentId
      return currentDeptId === dep.id
    })
    
    if (employeesInDept.length > 0) {
      alert(`⚠️ KHÔNG THỂ XÓA!\n\nPhòng [${dep.name}] đang có ${employeesInDept.length} nhân sự.\nVui lòng chuyển họ sang phòng khác trước khi xóa.`)
      return
    }

    deptToDelete.value = dep
    idToDelete.value = dep.id
    isConfirmModalOpen.value = true

  } catch (error) {
    alert('Có lỗi xảy ra khi kiểm tra dữ liệu: ' + error.message)
    console.error(error)
  }
}

const executeDelete = () => {
  if (idToDelete.value) {
    const name = deptToDelete.value?.name || 'Phòng ban'
    
    departmentStore.deleteDepartment(idToDelete.value)
    
    alert(`Đã xóa thành công phòng ban: ${name}`)
    
    isConfirmModalOpen.value = false
    deptToDelete.value = null
    idToDelete.value = null
  }
}
</script>

<template>
  <div class="p-6">
    <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Danh sách phòng ban</h2>
        <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Quản lý cơ cấu phòng ban, ngân sách và trưởng phòng một cách trực quan.</p>
      </div>

      <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div class="flex-1 sm:flex-none">
          <FormInput 
            v-model="departmentStore.searchQuery" 
            placeholder="Tìm tên, mã, trưởng phòng..." 
          />
        </div>

        <button
          @click="openCreateModal"
          class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold shadow-sm transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          Thêm Mới
        </button>
      </div>
    </div>

    <div class="grid gap-4 mb-6 md:grid-cols-3">
      <StatCard title="Tổng phòng ban" :value="totalDepartments" subtitle="Số lượng phòng ban hiện có" color="blue" />
      <StatCard title="Tổng ngân sách" :value="formatCurrency(totalBudget)" subtitle="Ngân sách phân bổ cho phòng ban" color="green" />
      <StatCard title="Tổng nhân sự" :value="totalEmployees" subtitle="Tổng số nhân sự trong hệ thống" color="yellow" />
    </div>

    <div v-if="departmentStore.isLoading" class="text-center py-10">
      <p class="text-lg text-gray-500 font-medium">Đang tải dữ liệu...</p>
    </div>

    <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div class="overflow-x-auto w-full">
        <table class="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
          <thead class="bg-gray-100 dark:bg-gray-900 border-b-2 border-gray-300 dark:border-gray-600">
            <tr>
              <th class="px-6 py-4 whitespace-nowrap text-left text-sm font-bold text-black dark:text-white uppercase tracking-wider">Mã Phòng</th>
              <th class="px-6 py-4 whitespace-nowrap text-left text-sm font-bold text-black dark:text-white uppercase tracking-wider">Tên Phòng Ban</th>
              <th class="px-6 py-4 whitespace-nowrap text-left text-sm font-bold text-black dark:text-white uppercase tracking-wider">Trưởng Phòng</th>
              <th class="px-6 py-4 whitespace-nowrap text-center text-sm font-bold text-black dark:text-white uppercase tracking-wider">Số Nhân Sự</th>
              <th class="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-black dark:text-white uppercase tracking-wider">Ngân Sách</th>
              <th class="px-6 py-4 whitespace-nowrap text-center text-sm font-bold text-black dark:text-white uppercase tracking-wider">Thao Tác</th>
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
                {{ dep.employeeName || 'Chưa bổ nhiệm' }} 
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
    </div>

    <DepartmentModal
      :is-open="isModalOpen"
      :department-data="selectedDept"
      :employees-list="availableEmployees"
      @close="isModalOpen = false"
      @save="handleSaveDepartment"
    />

    <ConfirmModal
      :is-open="isConfirmModalOpen"
      title="Cảnh báo xóa phòng ban"
      :message="`Bạn có chắc chắn muốn xóa phòng ban [${deptToDelete?.name}]? Hành động này sẽ không thể hoàn tác.`"
      type="danger"
      confirm-text="Xóa phòng ban"
      @confirm="executeDelete"
      @cancel="isConfirmModalOpen = false"
    />
  </div>
</template>