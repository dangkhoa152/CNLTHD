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
              <!-- <svg v-else class="w-12 h-12 text-gray-300" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg> -->
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
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Phòng ban <span class="text-red-500">*</span></label>
                  <select v-model="form.department" class="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="">Chọn phòng ban</option>
                    <option v-for="d in departments" :key="d" :value="d">{{ d }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Chức vụ <span class="text-red-500">*</span></label>
                  <input v-model="form.position" type="text" class="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="VD: Sales Executive" />
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

<script lang="ts" setup>
import { reactive, computed, watch } from 'vue'

const props = defineProps<{
  isEdit: Boolean,
  item?: any,
  departments: string[] // Truyền dữ liệu nhân viên vào nếu là chế độ Sửa/Xem
}>()

const emit = defineEmits(['close', 'create', 'update'])
// Xác định đang ở chế độ sửa hay tạo
const isEdit = computed(() => !!props.item)

// Khởi tạo state cho form mặc định
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

// Dùng watch + immediate để nạp dữ liệu khi mở Modal
watch(() => props.item, (newVal) => {
  if (newVal) {
    // Chế độ Sửa: Rải dữ liệu vào form
    Object.assign(form, newVal)
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
    form.joinDate = new Date().toISOString().split('T')[0] // Mặc định ngày hôm nay
    form.avatar = ''
  }
}, { immediate: true })

function submit() {
  // Validate sơ bộ (Bạn có thể làm kỹ hơn ở đây)
  if (!form.employeeCode || !form.name || !form.email || !form.department) {
    alert('Vui lòng điền đầy đủ các trường bắt buộc (*)')
    return
  }
  // Nếu là tạo mới, tự động tạo ID và departmentId tương ứng (giả lập)
  if (!isEdit.value) {
    // Giả lập map tên phòng ban ra mã phòng ban
    const deptMap: Record<string, string> = {
      'Phòng Kinh doanh': 'DEP05',
      'Phòng IT': 'DEP01',
      'Phòng Kế Toán': 'DEP04',
      'Phòng Nhân sự': 'DEP02',
      'Phòng Marketing': 'DEP03',
      'Phòng Chăm sóc Khách hàng': 'DEP06'
    }
    form.departmentId = deptMap[form.department]
    emit('create', {...form} )
  } else{
    emit('update',  { id: props.item.id, patch: {...form }})
  }
}
</script>

<style scoped>
/* Thu gọn thanh cuộn cho đẹp */
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
</style>