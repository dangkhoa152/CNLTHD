<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  departmentData: Object,
  employeesList: Array
})

const emit = defineEmits(['close', 'save'])
const formData = ref({})

// Thêm biến computed để kiểm tra xem là Thêm hay Sửa
const isEditMode = computed(() => !!props.departmentData?.id)

const isDropdownOpen = ref(false)
const searchManagerQuery = ref('')

watch(() => props.departmentData, (newData) => {
  if (newData && newData.id) {
    formData.value = { ...newData } 
  } else {
    formData.value = { name: '', budget: 0, description: '', manager: '' }
    searchManagerQuery.value = ''
  }
}, { immediate: true })

// ==========================================
// LOGIC CHO DROPDOWN TÌM KIẾM TRƯỞNG PHÒNG
// ==========================================

// Lọc danh sách nhân viên dựa trên ô tìm kiếm
const filteredEmployees = computed(() => {
  if (!searchManagerQuery.value) return props.employeesList
  const query = searchManagerQuery.value.toLowerCase()
  return props.employeesList.filter(emp => 
    emp.name.toLowerCase().includes(query) || 
    emp.position.toLowerCase().includes(query)
  )
})

// Hàm chọn người làm trưởng phòng
const selectManager = (emp) => {
  formData.value.manager = emp.name
  isDropdownOpen.value = false  
  searchManagerQuery.value = ''
}

// ==========================================

const handleSave = () => {
  emit('save', formData.value)
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto">
    <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="emit('close')"></div>

    <div class="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6 z-50">
      
      <div class="flex justify-between items-center mb-5 border-b pb-3 dark:border-gray-700">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white">
          {{ isEditMode ? 'Cập nhật Phòng Ban' : 'Thêm Phòng Ban Mới' }}
        </h3>
        <button @click="emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Tên phòng ban</label>
          <input v-model="formData.name" type="text" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Ngân sách (VNĐ)</label>
          <input v-model="formData.budget" type="number" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
        </div>

        <div v-if="isEditMode" class="relative">
          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Trưởng phòng</label>
          
          <div @click="isDropdownOpen = !isDropdownOpen" class="w-full px-4 py-2 border rounded-lg cursor-pointer bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white flex justify-between items-center hover:border-blue-500 transition-colors">
            <span :class="{'text-gray-400': !formData.manager}">{{ formData.manager || '-- Vui lòng chọn trưởng phòng --' }}</span>
            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
          <div v-if="isDropdownOpen" @click="isDropdownOpen = false" class="fixed inset-0 z-10"></div>
          <div v-if="isDropdownOpen" class="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 border dark:border-gray-600 rounded-lg shadow-xl overflow-hidden">
            <div class="p-2 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <input v-model="searchManagerQuery" type="text" placeholder="Tìm kiếm..." class="w-full px-3 py-1.5 text-sm border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" autofocus />
            </div>
            <ul class="max-h-48 overflow-y-auto">
              <li v-for="emp in filteredEmployees" :key="emp.id" @click="selectManager(emp)" class="px-4 py-2 text-sm cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors flex flex-col">
                <span class="font-bold text-gray-900 dark:text-white">{{ emp.name }}</span>
                <span class="text-xs text-gray-500 dark:text-gray-400">{{ emp.position }}</span>
              </li>
            </ul>
          </div>
          </div>
        
        <div v-else class="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-sm text-blue-700 dark:text-blue-300">
          <span class="font-bold">💡 Mẹo:</span> Sau khi tạo phòng ban, hãy sang trang Nhân sự để thêm nhân viên vào phòng này. Sau đó bạn mới có thể bổ nhiệm Trưởng phòng.
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Mô tả</label>
          <textarea v-model="formData.description" rows="3" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
        </div>
      </div>

      <div class="mt-6 flex justify-end gap-3 pt-4 border-t dark:border-gray-700">
        <button @click="emit('close')" class="px-5 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 font-bold">Hủy</button>
        <button @click="handleSave" class="px-5 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-bold">Lưu thay đổi</button>
      </div>
    </div>
  </div>
</template>