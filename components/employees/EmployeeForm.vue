<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
      
      <div class="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
        <h2 class="text-xl font-bold text-gray-800">
          {{ isEdit ? 'Cập nhật Nhân viên' : 'Thêm Nhân viên Mới' }}
        </h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-red-500 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <div class="p-6 overflow-y-auto flex-1 custom-scrollbar">
        <div class="flex flex-col md:flex-row gap-8">
          
          <div class="w-full md:w-1/4 flex flex-col items-center">
            <div class="w-32 h-32 rounded-full border-4 border-gray-100 shadow-sm overflow-hidden mb-4 bg-gray-50 flex items-center justify-center">
              <img v-if="form.avatar" :src="form.avatar || '/public/images/avatar.png'" alt="avatar" class="w-full h-full object-cover" />
              <img v-else src='/public/images/avatar.png' alt="avatar" class="w-full h-full object-cover" />
            </div>
            <button class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Đổi ảnh đại diện
            </button>
          </div>

          <div class="w-full md:w-3/4 space-y-6">
            
            <div>
              <h3 class="text-sm font-bold text-blue-600 uppercase tracking-wider mb-3 border-b pb-1">Công việc</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Mã NV <span class="text-red-500">*</span></label>
                  <input v-model="form.employeeCode" type="text" :disabled="isEdit" class="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="VD: EMP0001" />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Ngày vào làm</label>
                  <input v-model="form.joinDate" type="date" class="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                
                <!-- DROPDOWN PHÒNG BAN MỚI -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Phòng ban <span class="text-red-500">*</span></label>
                  <select 
                    v-model="form.department" 
                    @change="handleDepartmentChange"
                    class="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Chọn phòng ban</option>
                    <option v-for="d in departments" :key="d.id" :value="d.name">
                      {{ d.name }}
                    </option>
                  </select>
                </div>
                
                <!-- DROPDOWN CHỨC VỤ ĐỘNG (Dựa vào phòng ban) -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Chức vụ <span class="text-red-500">*</span></label>
                  <select 
                    v-model="form.position" 
                    :disabled="!form.department"
                    class="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    <option value="">Chọn chức vụ</option>
                    <option v-for="pos in availablePositions" :key="pos" :value="pos">
                      {{ pos }}
                    </option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                  <select v-model="form.status" class="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="Đang làm việc">Đang làm việc</option>
                    <option value="Tạm nghỉ">Nghỉ phép</option>
                    <option value="Nghỉ việc">Nghỉ việc</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-bold text-blue-600 uppercase tracking-wider mb-3 border-b pb-1">Cá nhân</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Họ và tên <span class="text-red-500">*</span></label>
                  <input v-model="form.name" type="text" class="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Nguyễn Văn A" />
                </div>
                <div class="grid grid-cols-2 gap-2">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
                    <select v-model="form.gender" class="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none">
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                    <input v-model="form.dateOfBirth" type="date" class="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-bold text-blue-600 uppercase tracking-wider mb-3 border-b pb-1">Liên hệ</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Email <span class="text-red-500">*</span></label>
                  <input v-model="form.email" type="email" class="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="ví dụ: email@company.com" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                  <input v-model="form.phone" type="tel" class="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="09xx xxx xxx" />
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                  <input v-model="form.address" type="text" class="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Số nhà, Tên đường, Quận/Huyện, Tỉnh/Thành phố" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div class="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
        <button @click="$emit('close')" class="px-5 py-2 border rounded-md text-gray-700 hover:bg-gray-100 font-medium transition-colors">
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

const props = defineProps({
  isEdit: Boolean,
  item: Object,
  // Đã sửa thành mảng object để nhận toàn bộ thông tin phòng ban (bao gồm id, name, position)
  departments: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'create', 'update'])

const isEdit = computed(() => !!props.item)

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

// === LOGIC NẠP DỮ LIỆU KHI MỞ FORM ===
watch(() => props.item, (newVal) => {
  if (newVal) {
    Object.assign(form, newVal)
    
    // Móc dữ liệu phòng ban và chức vụ từ lịch sử (history)
    if (newVal.history && newVal.history.length > 0) {
      form.department = newVal.history[0].department || ''
      form.departmentId = newVal.history[0].departmentId || ''
      form.position = newVal.history[0].position || ''
    }
  } else {
    // Chế độ Thêm mới: Reset form
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

// === LOGIC LIÊN KẾT PHÒNG BAN VÀ CHỨC VỤ ===

// Tính toán danh sách chức vụ dựa trên phòng ban đang chọn
const availablePositions = computed(() => {
  if (!form.department) return []
  const selectedDeptObj = props.departments.find(d => d.name === form.department)
  // Trả về mảng position của phòng ban đó, nếu không có thì trả mảng rỗng
  return selectedDeptObj && Array.isArray(selectedDeptObj.position) ? selectedDeptObj.position : []
})

// 2. Xử lý khi người dùng đổi phòng ban khác
function handleDepartmentChange() {
  const selectedDeptObj = props.departments.find(d => d.name === form.department)
  if (selectedDeptObj) {
    form.departmentId = selectedDeptObj.id
  } else {
    form.departmentId = ''
  }
  // Reset chức vụ vì phòng mới có danh sách chức vụ mới
  form.position = ''
}

// === LOGIC GỬI DỮ LIỆU ===
function submit() {
  if (!form.employeeCode || !form.name || !form.email || !form.department || !form.position) {
    alert('Vui lòng điền đầy đủ các trường bắt buộc (*)')
    return
  }

  if (!isEdit.value) {
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
</style>