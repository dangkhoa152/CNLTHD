<template>
  <div class="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4 transition-colors">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden transition-colors">
      
      <div class="px-6 py-4 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900 transition-colors">
        <h2 class="text-xl font-bold text-gray-800 dark:text-white">
          {{ isEdit ? 'Cập nhật Nhân viên' : 'Thêm Nhân viên Mới' }}
        </h2>
        <button @click="$emit('close')" class="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <div class="p-6 overflow-y-auto flex-1 custom-scrollbar">
        <div class="flex flex-col md:flex-row gap-8">
          
          <div class="w-full md:w-1/4 flex flex-col items-center">
            <div class="w-32 h-32 rounded-full border-4 border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden mb-4 bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors">
              <img v-if="form.avatar" :src="form.avatar || '/public/images/avatar.png'" alt="avatar" class="w-full h-full object-cover" />
              <img v-else src='/public/images/avatar.png' alt="avatar" class="w-full h-full object-cover" />
            </div>
            <button class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Đổi ảnh đại diện
            </button>
          </div>

          <div class="w-full md:w-3/4 space-y-6">
            
            <div>
              <h3 class="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-3 border-b dark:border-gray-700 pb-1">Công việc</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mã NV <span class="text-red-500">*</span></label>
                  <input v-model="form.employeeCode" type="text" :disabled="isEdit" class="w-full border dark:border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-500 transition-colors" placeholder="VD: EMP0001" />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ngày vào làm</label>
                  <input v-model="form.joinDate" type="date" class="w-full border dark:border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors" />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phòng ban <span class="text-red-500">*</span></label>
                  <select 
                    v-model="form.department" 
                    @change="handleDepartmentChange"
                    :disabled="isEdit && auth.user?.role === 'employee'"
                    class="w-full border dark:border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                  >
                    <option value="">Chọn phòng ban</option>
                    <option v-for="d in departments" :key="d.id" :value="d.name">{{ d.name }}</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Chức vụ <span class="text-red-500">*</span></label>
                  <select 
                    v-model="form.position" 
                    :disabled="!form.department || (isEdit && auth.user?.role === 'employee')"
                    class="w-full border dark:border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-500 transition-colors"
                  >
                    <option value="">Chọn chức vụ</option>
                    <option v-for="pos in availablePositions" :key="pos" :value="pos">{{ pos }}</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Trạng thái</label>
                  <select v-model="form.status" :disabled="isEdit && auth.user?.role === 'employee'" class="w-full border dark:border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors">
                    <option value="Đang làm việc">Đang làm việc</option>
                    <option value="Tạm nghỉ">Nghỉ phép</option>
                    <option value="Nghỉ việc">Nghỉ việc</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-3 border-b dark:border-gray-700 pb-1">Cá nhân</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Họ và tên <span class="text-red-500">*</span></label>
                  <input v-model="form.name" type="text" class="w-full border dark:border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors" placeholder="Nguyễn Văn A" />
                </div>
                <div class="grid grid-cols-2 gap-2">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Giới tính</label>
                    <select v-model="form.gender" class="w-full border dark:border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors">
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ngày sinh</label>
                    <input v-model="form.dateOfBirth" type="date" class="w-full border dark:border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors" />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-3 border-b dark:border-gray-700 pb-1">Liên hệ</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email <span class="text-red-500">*</span></label>
                  <input v-model="form.email" type="email" class="w-full border dark:border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors" placeholder="ví dụ: email@company.com" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Số điện thoại</label>
                  <input v-model="form.phone" type="tel" class="w-full border dark:border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors" placeholder="09xx xxx xxx" />
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Địa chỉ</label>
                  <input v-model="form.address" type="text" class="w-full border dark:border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors" placeholder="Số nhà, Tên đường, Quận/Huyện, Tỉnh/Thành phố" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div class="px-6 py-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-end gap-3 transition-colors">
        <button @click="$emit('close')" class="px-5 py-2 border dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-colors">
          Hủy bỏ
        </button>
        <button @click="submit" class="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium shadow-sm transition-colors">
          {{ isEdit ? 'Lưu thay đổi' : 'Tạo nhân viên' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, watch } from 'vue'
import { useEmployeeStore } from '@/stores/employeeStore'
import { useAuthStore } from '@/stores/auth'

const employeeStore = useEmployeeStore()

const props = defineProps({
  isEdit: Boolean,
  item: Object,
  departments: {
    type: Array,
    default: () => []
  }
})

const auth = useAuthStore()
const emit = defineEmits(['close', 'create', 'update'])

const form = reactive({
  employeeCode: '',
  name: '',
  gender: 'Nam',
  dateOfBirth: '',
  email: '',
  phone: '',
  address: '',
  departmentId: '', 
  department: '',
  position: '',
  status: 'Đang làm việc',
  joinDate: '',
  avatar: ''
})

watch(() => props.item, (newVal) => {
  if (newVal) {
    Object.assign(form, newVal)
    if (newVal.history && newVal.history.length > 0) {
      form.department = newVal.history[0].department || ''
      form.departmentId = newVal.history[0].departmentId || ''
      form.position = newVal.history[0].position || ''
      form.joinDate = newVal.history[newVal.history.length-1].startDate || ''
    }
  } else {
    form.employeeCode = ''
    form.name = ''
    form.gender = 'Nam'
    form.dateOfBirth = ''
    form.email = ''
    form.phone = ''
    form.address = ''
    form.departmentId = ''
    form.department = ''
    form.position = ''
    form.status = 'Đang làm việc'
    form.joinDate = new Date().toISOString().split('T')[0] 
    form.avatar = ''
  }
}, { immediate: true })

const availablePositions = computed(() => {
  if (!form.department) return []
  const selectedDeptObj = props.departments.find(d => d.name === form.department)
  return selectedDeptObj && Array.isArray(selectedDeptObj.position) ? selectedDeptObj.position : []
})

function handleDepartmentChange() {
  const selectedDeptObj = props.departments.find(d => d.name === form.department)
  if (selectedDeptObj) {
    form.departmentId = selectedDeptObj.id
  } else {
    form.departmentId = ''
  }
  form.position = ''
}

function submit() {
  if (!form.employeeCode || !form.name || !form.email || !form.department || !form.position) {
    alert('Vui lòng điền đầy đủ các trường bắt buộc (*)')
    return
  }
  
  const isDuplicate = employeeStore.employees.some(
    (e) =>
      e.employeeCode === form.employeeCode &&
      e.id !== props.item?.id
  )

  if (isDuplicate) {
    alert('Mã nhân viên đã tồn tại!')
    return
  }  

  if (!props.isEdit) {
    emit('create', {...form})
  } else {
    emit('update', { id: props.item.id, patch: {...form} })
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #475569; }
</style>