<template>
  <div> <div class="p-6 max-w-7xl mx-auto" v-if="employee">
      <button v-if="auth.user?.role === 'admin'" @click="$router.push('/employees')" class="mb-6 flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
        <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Quay lại danh sách
      </button>

      <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700 mb-6 flex flex-col md:flex-row gap-8 items-start">
        <div class="flex flex-col items-center min-w-[200px]">
          <div class="w-32 h-32 rounded-full bg-blue-50 dark:bg-gray-700 flex items-center justify-center text-5xl font-bold text-blue-600 dark:text-blue-400 shadow-inner mb-4 border-4 border-white dark:border-gray-600 ring-1 ring-gray-100 dark:ring-gray-800 overflow-hidden">
            <img v-if="employee.avatar" :src="employee.avatar || '/images/avatar.png'" class="w-full h-full object-cover" />
            <span v-else>{{ employee.name ? employee.name.charAt(0) : '?' }}</span>
          </div>
          <h1 class="text-2xl font-bold text-gray-800 dark:text-white text-center">{{ employee.name }}</h1>
          <p class="text-blue-600 dark:text-blue-400 font-medium mt-1 text-center">{{ currentRole?.position || employee.position || 'Chưa cập nhật' }}</p>
          <span class="mt-3 px-4 py-1.5 text-sm rounded-full font-medium" :class="employee.status === 'Đang làm việc' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'">
            {{ employee.status }}
          </span>
        </div>

        <div class="flex-1 w-full border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700 md:pl-8 pt-4 md:pt-0">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">Hồ sơ cá nhân</h3>
            
            <button 
              v-if="auth.user?.role === 'employee'" 
              @click="open"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              Sửa thông tin
            </button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
            <div class="flex flex-col"><span class="text-gray-500 dark:text-gray-400 mb-1">Mã nhân viên</span> <span class="font-medium text-gray-900 dark:text-gray-200">{{ employee.employeeCode }}</span></div>
            <div class="flex flex-col"><span class="text-gray-500 dark:text-gray-400 mb-1">Giới tính</span> <span class="font-medium text-gray-900 dark:text-gray-200">{{ employee.gender }}</span></div>
            <div class="flex flex-col"><span class="text-gray-500 dark:text-gray-400 mb-1">Ngày sinh</span> <span class="font-medium text-gray-900 dark:text-gray-200">{{ getNowString(employee.dateOfBirth) }}</span></div>
            <div class="flex flex-col"><span class="text-gray-500 dark:text-gray-400 mb-1">Phòng ban hiện tại</span> <span class="font-medium text-gray-900 dark:text-gray-200">{{ currentRole?.department || employee.department || 'Chưa cập nhật' }}</span></div>
            <div class="flex flex-col"><span class="text-gray-500 dark:text-gray-400 mb-1">Số điện thoại</span> <span class="font-medium text-gray-900 dark:text-gray-200">{{ employee.phone }}</span></div>
            <div class="flex flex-col"><span class="text-gray-500 dark:text-gray-400 mb-1">Email công việc</span> <span class="font-medium text-gray-900 dark:text-gray-200">{{ employee.email }}</span></div>
            <div class="flex flex-col md:col-span-2"><span class="text-gray-500 dark:text-gray-400 mb-1">Địa chỉ thường trú</span> <span class="font-medium text-gray-900 dark:text-gray-200">{{ employee.address }}</span></div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700 h-full">
          <div class="flex items-center justify-between mb-6">
            <h3 class="font-bold text-lg text-gray-800 dark:text-white">Lịch sử thăng tiến & Công tác</h3>
            <span class="text-xs font-medium bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded">{{ employee.history?.length || 0 }} bản ghi</span>
          </div>
          
          <div v-if="!employee.history || employee.history.length === 0" class="text-gray-500 dark:text-gray-400 italic text-center py-8">
            Chưa có ghi nhận lịch sử công tác.
          </div>

          <ul v-else class="relative border-l-2 border-blue-200 dark:border-blue-800 ml-3 space-y-8">
            <li v-for="(item, index) in employee.history" :key="item.id || index" class="pl-6 relative">
              <div class="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-4 border-white dark:border-gray-800 shadow-sm" :class="index === 0 ? 'bg-green-500 ring-2 ring-green-200 dark:ring-green-900' : 'bg-blue-400'"></div>
              <div class="text-sm font-semibold mb-1 inline-block px-2 py-0.5 rounded" :class="index === 0 ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'">
                {{ getNowString(item.startDate) }} - {{ item.endDate ? getNowString(item.endDate) : 'Hiện tại' }}
              </div>
              <h4 class="font-bold text-gray-800 dark:text-white text-lg mt-1">{{ item.position }}</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-1">🏢 {{ item.department }}</p>
            </li>
          </ul>
        </div>

        <div class="bg-white dark:bg-gray-800 p-0 rounded-xl shadow-sm border dark:border-gray-700 h-full overflow-hidden">
          <div class="p-6 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
            <h3 class="font-bold text-lg text-gray-800 dark:text-white">Lịch sử đơn nghỉ phép</h3>
            <span class="text-xs font-medium bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 px-2 py-1 rounded">{{ employeeLeaves.length }} đơn</span>
          </div>
          
          <div v-if="employeeLeaves.length === 0" class="text-gray-500 italic text-center py-12">
            Nhân viên này chưa từng gửi đơn nghỉ phép nào.
          </div>

          <table v-else class="w-full text-left text-sm border-collapse">
            <thead class="bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
              <tr>
                <th class="p-4 font-medium text-left">Ngày gửi</th>
                <th class="p-4 font-medium">Thời gian</th>
                <th class="p-4 font-medium">Lý do</th>
                <th class="p-4 font-medium text-right">Trạng thái</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
              <tr v-for="leave in employeeLeaves" :key="leave.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td class="p-4">
                  <div class="text-xs text-gray-900 dark:text-gray-300 mt-0.5">{{ getNowString(leave.createdAt) }}</div>
                </td>
                <td class="p-4 text-gray-600 dark:text-gray-300">
                  {{ getNowString(leave.fromDate) }} <span class="text-xs text-gray-400 dark:text-gray-500"> đến </span> {{ getNowString(leave.toDate) }}
                </td>
                <td class="p-4 text-gray-600 dark:text-gray-300">{{ leave.reason }}</td>
                <td class="p-4 text-right">
                  <span class="px-2.5 py-1 text-xs rounded-full font-medium inline-block" :class="{
                      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400': leave.status === 'Đã duyệt',
                      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400': leave.status === 'Từ chối',
                      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400': leave.status === 'Chờ duyệt'
                    }">
                    {{ leave.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <div v-else class="flex flex-col justify-center items-center h-screen text-gray-500 dark:text-gray-400">
      <svg class="animate-spin mb-3 h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
      <p>Đang tải hồ sơ...</p>
    </div>

    <EmployeeForm 
      v-if="showEditModal" 
      :isEdit="true" 
      :departments="depStore.departments" 
      :item="employee" 
      @close="closeForm" 
      @update="update" 
    />

  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['auth'] 
})

import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEmployeeStore } from '@/stores/employeeStore' 
import { useLeaveRequestStore } from '@/stores/leaveRequestStore' 
import { useDepartmentStore } from '@/stores/departmentStore' 
import { useActivityStore } from '@/stores/activityStore' 
import { useAuthStore } from '@/stores/auth'
import getNowString from '~/utils/formatDate'
import { toast } from 'vue3-toastify' 

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const employeeStore = useEmployeeStore()
const leaveRequestStore = useLeaveRequestStore()
const depStore = useDepartmentStore()
const activityStore = useActivityStore()

const employee = ref(null)
const showEditModal = ref(false)
const currentIdOnURL = route.params.id

const employeeLeaves = computed(() => {
  if (!employee.value) return []
  return leaveRequestStore.leaveRequests.filter(item => 
    String(item.employeeCode) === String(employee.value.employeeCode)
  )
})

const currentRole = computed(() => {
  return employee.value?.history?.[0] || null
})
 
onMounted(async () => {
  const rawId = String(currentIdOnURL).replace(/\D/g, '') 
  const employeeId = Number(rawId)

  // Gọi API tải dữ liệu 
  await Promise.all([
    employeeStore.fetchEmployees(),
    leaveRequestStore.fetchLeaveRequests(),
    depStore.fetchDepartments() // Đảm bảo đã tải phòng ban để modal khỏi bị lỗi
  ])
  
  const foundEmployee = employeeStore.employees.find(emp => emp.id === employeeId)
  
  if (!foundEmployee) {
    alert('Không tìm thấy dữ liệu nhân viên!')
    router.push('/employees')
    return
  }
  
  if (auth.user?.role === 'employee' && auth.user?.id !== foundEmployee.id) {
    navigateTo('/') 
    return
  }
  
  employee.value = foundEmployee
})

function open() {
  showEditModal.value = true
}

function update(payload) {
  if (showEditModal.value) {
    if (!payload || !payload.id) return
    
    // 1. Cập nhật vào Store/JSON
    employeeStore.updateEmployee(payload.id, payload.patch || {})
    
    // 2. Cập nhật ngay lên giao diện Profile hiện tại (Reactivity)
    Object.assign(employee.value, payload.patch || {})
    
    // 3. Đóng form và ghi log
    closeForm()
    logUpdate(payload)
  }
}

function closeForm() {
  showEditModal.value = false
}

function logUpdate(payload) {
  const targetName = employee.value?.name || 'Hồ sơ cá nhân'
  const userName = auth.user?.name || 'Hệ thống'

  // Ghi vào Activity Store
  activityStore.logActivity('edit', 'Cập nhật hồ sơ nhân viên', targetName, userName)
  
  // Hiển thị thông báo Toast
  if (typeof toast !== 'undefined') {
    toast.success(`Cập nhật thành công!`)
  } else {
    alert('Cập nhật thành công!')
  }
}
</script>