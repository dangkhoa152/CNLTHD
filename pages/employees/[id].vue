<template>
  <div class="p-6 max-w-7xl mx-auto" v-if="employee">
    
    <button @click="$router.back()" class="mb-6 flex items-center text-gray-500 hover:text-blue-600 transition-colors font-medium">
      <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
      Quay lại danh sách
    </button>

    <div class="bg-white p-6 rounded-xl shadow-sm border mb-6 flex flex-col md:flex-row gap-8 items-start">
      
      <div class="flex flex-col items-center min-w-[200px]">
        <div class="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center text-5xl font-bold text-blue-600 shadow-inner mb-4 border-4 border-white ring-1 ring-gray-100">
          {{ employee.name.charAt(0) }}
        </div>
        <h1 class="text-2xl font-bold text-gray-800 text-center">{{ employee.name }}</h1>
        <p class="text-blue-600 font-medium mt-1 text-center">{{ currentRole?.position || 'Chưa cập nhật' }}</p>
        <span class="mt-3 px-4 py-1.5 text-sm rounded-full font-medium" :class="employee.status === 'Đang làm việc' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'">
          {{ employee.status }}
        </span>
      </div>

      <div class="flex-1 w-full border-t md:border-t-0 md:border-l border-gray-100 md:pl-8 pt-4 md:pt-0">
        <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Hồ sơ cá nhân</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
          
          <div class="flex flex-col"><span class="text-gray-500 mb-1">Mã nhân viên</span> <span class="font-medium text-gray-900">{{ employee.employeeCode }}</span></div>
          <div class="flex flex-col"><span class="text-gray-500 mb-1">Giới tính</span> <span class="font-medium text-gray-900">{{ employee.gender }}</span></div>
          <div class="flex flex-col"><span class="text-gray-500 mb-1">Ngày sinh</span> <span class="font-medium text-gray-900">{{ formatDate(employee.dateOfBirth) }}</span></div>
          <div class="flex flex-col"><span class="text-gray-500 mb-1">Phòng ban hiện tại</span> <span class="font-medium text-gray-900">{{ currentRole?.department || 'Chưa cập nhật' }}</span></div>
          <div class="flex flex-col"><span class="text-gray-500 mb-1">Số điện thoại</span> <span class="font-medium text-gray-900">{{ employee.phone }}</span></div>
          <div class="flex flex-col"><span class="text-gray-500 mb-1">Email công việc</span> <span class="font-medium text-gray-900">{{ employee.email }}</span></div>
          <div class="flex flex-col md:col-span-2"><span class="text-gray-500 mb-1">Địa chỉ thường trú</span> <span class="font-medium text-gray-900">{{ employee.address }}</span></div>
          
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      
      <div class="bg-white p-6 rounded-xl shadow-sm border h-full">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-bold text-lg text-gray-800">Lịch sử thăng tiến & Công tác</h3>
          <span class="text-xs font-medium bg-blue-50 text-blue-600 px-2 py-1 rounded">{{ employee.history?.length || 0 }} bản ghi</span>
        </div>
        
        <div v-if="!employee.history || employee.history.length === 0" class="text-gray-500 italic text-center py-8">
          Chưa có ghi nhận lịch sử công tác.
        </div>

        <ul v-else class="relative border-l-2 border-blue-200 ml-3 space-y-8">
          <li v-for="(item, index) in employee.history" :key="item.id" class="pl-6 relative">
            
            <div 
              class="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-4 border-white shadow-sm"
              :class="index === 0 ? 'bg-green-500 ring-2 ring-green-200' : 'bg-blue-400'"
            ></div>
            
            <div class="text-sm font-semibold mb-1 inline-block px-2 py-0.5 rounded" :class="index === 0 ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'">
              {{ formatDate(item.startDate) }} - {{ item.endDate ? formatDate(item.endDate) : 'Hiện tại' }}
            </div>
            
            <h4 class="font-bold text-gray-800 text-lg mt-1">{{ item.position }}</h4>
            <p class="text-sm text-gray-600 mt-1 flex items-center gap-1">
              🏢 {{ item.department }}
            </p>
          </li>
        </ul>
      </div>

      <div class="bg-white p-0 rounded-xl shadow-sm border h-full overflow-hidden">
        <div class="p-6 border-b flex justify-between items-center bg-gray-50">
          <h3 class="font-bold text-lg text-gray-800">Lịch sử đơn nghỉ phép</h3>
          <span class="text-xs font-medium bg-gray-200 text-gray-700 px-2 py-1 rounded">{{ employeeLeaves.length }} đơn</span>
        </div>
        
        <div v-if="employeeLeaves.length === 0" class="text-gray-500 italic text-center py-12">
          Nhân viên này chưa từng gửi đơn nghỉ phép nào.
        </div>

        <table v-else class="w-full text-left text-sm border-collapse">
          <thead class="bg-white text-gray-500 border-b">
            <tr>
              <th class="p-4 font-medium">Loại đơn</th>
              <th class="p-4 font-medium">Thời gian nghỉ</th>
              <th class="p-4 font-medium text-right">Trạng thái</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="leave in employeeLeaves" :key="leave.id" class="hover:bg-gray-50 transition-colors">
              <td class="p-4">
                <div class="font-medium text-gray-800">{{ leave.type }}</div>
                <div class="text-xs text-gray-400 mt-0.5">Nộp: {{ formatDate(leave.submitDate) }}</div>
              </td>
              <td class="p-4 text-gray-600">
                {{ formatDate(leave.startDate) }} <br/>
                <span class="text-xs text-gray-400">đến</span> {{ formatDate(leave.endDate) }}
              </td>
              <td class="p-4 text-right">
                <span 
                  class="px-2.5 py-1 text-xs rounded-full font-medium inline-block"
                  :class="{
                    'bg-green-100 text-green-700': leave.status === 'Đã duyệt',
                    'bg-red-100 text-red-700': leave.status === 'Từ chối',
                    'bg-yellow-100 text-yellow-700': leave.status === 'Chờ duyệt'
                  }"
                >
                  {{ leave.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>
  
  <div v-else class="flex justify-center items-center h-screen text-gray-500">
    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
    Đang tải hồ sơ...
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const employeeId = route.params.id as string

// 1. Khai báo state
const employee = ref<any>(null)
const employeeLeaves = ref<any[]>([])

// 2. Computed chức vụ hiện tại
const currentRole = computed(() => {
  if (employee.value?.history?.length > 0) {
    return employee.value.history[0]
  }
  return null
})

// 3. Giả lập Fetch dữ liệu (Trong đồ án thực tế bạn sẽ import Store vào đây)
onMounted(() => {
  // Thay thế khối này bằng logic gọi API/Store thực tế của bạn
  setTimeout(() => {
    // Mock Data Nhân viên
    employee.value = {
      "id": 14,
      "employeeCode": "EMP0014",
      "name": "Phạm Thị Thảo",
      "gender": "Nữ",
      "dateOfBirth": "1988-01-15",
      "email": "phamthithao14@company.com",
      "phone": "0931000014",
      "address": "Phường Phú Cường, Thủ Dầu Một, Bình Dương",
      "status": "Đang làm việc",
      "avatar": "/images/avatar.png",
      "history": [
        { "id": 1, "departmentId": "DEP05", "department": "Phòng Kinh doanh", "position": "Sales Manager", "startDate": "2025-06-01", "endDate": null },
        { "id": 2, "departmentId": "DEP05", "department": "Phòng Kinh doanh", "position": "Senior Sales Executive", "startDate": "2024-10-15", "endDate": "2025-05-31" },
        { "id": 3, "departmentId": "DEP05", "department": "Phòng Kinh doanh", "position": "Sales Executive", "startDate": "2024-03-23", "endDate": "2024-10-14" }
      ]
    }

    // Mock Data Đơn từ (Đã được lọc sẵn theo employeeId)
    employeeLeaves.value = [
      { id: 101, type: 'Nghỉ phép năm', submitDate: '2025-08-10', startDate: '2025-08-15', endDate: '2025-08-16', status: 'Đã duyệt' },
      { id: 102, type: 'Nghỉ ốm', submitDate: '2025-02-05', startDate: '2025-02-05', endDate: '2025-02-07', status: 'Đã duyệt' },
      { id: 103, type: 'Nghỉ việc riêng', submitDate: '2026-01-20', startDate: '2026-02-01', endDate: '2026-02-05', status: 'Chờ duyệt' }
    ]
  }, 400) // Giả lập độ trễ mạng để thấy UI loading
})

// 4. Hàm Helper format ngày
function formatDate(dateString: string) {
  if (!dateString) return ''
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}
</script>