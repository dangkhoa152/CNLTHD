<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black opacity-40" @click="$emit('close')"></div>
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl p-6 z-10">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-indigo-100 dark:bg-indigo-900
                    text-indigo-700 dark:text-indigo-200 
                    rounded-full flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M8 9a3 3 0 100-6 3 3 0 000 6z" /><path fill-rule="evenodd" d="M2 13.5A6.5 6.5 0 0110.5 7h1A6.5 6.5 0 0118 13.5V15a2 2 0 01-2 2H4a2 2 0 01-2-2v-1.5z" clip-rule="evenodd" /></svg>
          </div>
          <h3 class="text-lg font-semibold">{{ isEdit ? 'Sửa đơn nghỉ phép' : 'Tạo đơn nghỉ phép' }}</h3>
        </div>
        <button @click="$emit('close')" aria-label="Close" class="w-8 h-8 rounded-full
         hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center
          text-gray-600 dark:text-gray-300">X</button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Người xin <span class="text-sm text-red-600">*</span></label>
          <div class="mt-1 flex gap-2 relative">
            <input v-model="form.employeeName" @input="onNameInput" :disabled="isEdit" type="text" placeholder="Họ và tên" class="flex-1 rounded-md 
            border border-gray-200 focus:ring-2 focus:ring-indigo-200 dark:bg-gray-700 dark:border-gray-600 p-2" />
            <input v-model="form.employeeCode"  :disabled="isEdit" type="text" placeholder="Mã nhân viên" class="w-36 rounded-md 
            border border-gray-200 focus:ring-2 focus:ring-indigo-200 dark:bg-gray-700 dark:border-gray-600 p-2" />
            <input v-model="form.department" :disabled="isEdit" type="text" placeholder="Phòng ban" class="w-48 rounded-md 
            border border-gray-200 focus:ring-2 focus:ring-indigo-200 dark:bg-gray-700 dark:border-gray-600 p-2" />
          </div>
          <div v-if="showSuggestions && suggestions.length" class="absolute bg-white dark:bg-gray-800 border w-full max-w-2xl mt-1 rounded shadow z-20">
            <ul>
              <li v-for="s in suggestions" :key="s.employeeCode" @click="pickSuggestion(s)" class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">{{ s.name }} — {{ s.employeeCode }} — {{ s.department }}</li>
            </ul>
          </div>
          <div class="mt-1">
            <div v-if="errors.employeeName" class="text-sm text-red-600">{{ errors.employeeName }}</div>
            <div v-if="errors.employeeCode" class="text-sm text-red-600">{{ errors.employeeCode }}</div>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Từ ngày <span class="text-sm text-red-600">*</span></label>
          <input v-model="form.fromDate" type="date" class="mt-1 block w-full rounded-md 
          border border-gray-200 focus:ring-2 focus:ring-indigo-200 dark:bg-gray-700 dark:border-gray-600 p-2" />
          <div v-if="errors.fromDate" class="text-sm text-red-600 mt-1">{{ errors.fromDate }}</div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Đến ngày <span class="text-sm text-red-600">*</span></label>
          <input v-model="form.toDate" type="date" class="mt-1 block w-full rounded-md 
          border border-gray-200 focus:ring-2 focus:ring-indigo-200 dark:bg-gray-700 dark:border-gray-600 p-2" />
          <div v-if="errors.toDate" class="text-sm text-red-600 mt-1">{{ errors.toDate }}</div>
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Lý do</label>
          <textarea v-model="form.reason" rows="3" placeholder="Mô tả ngắn gọn lý do nghỉ" class="mt-1 block w-full rounded-md 
          border border-gray-200 focus:ring-2 focus:ring-indigo-200 dark:bg-gray-700 dark:border-gray-600 p-2"></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Trạng thái</label>
          <select v-model="form.status" class="mt-1 block w-full rounded-md border border-gray-200 focus:ring-2 focus:ring-indigo-200 dark:bg-gray-700 dark:border-gray-600 p-2">
            <option>Chờ duyệt</option>
            <option>Đã duyệt</option>
            <option>Đã từ chối</option>
          </select>
        </div>

      </div>

      <div class="mt-6 flex justify-end gap-2">
        <button @click="$emit('close')" class="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2 rounded">Hủy</button>
        <button @click="submit" class="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 text-white px-4 py-2 rounded">{{ isEdit ? 'Lưu' : 'Tạo' }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch, computed, ref, onMounted } from 'vue'

const props = defineProps({ item: { type: Object, default: null } })
const emit = defineEmits(['close','create','update'])
// Khởi tạo form với giá trị mặc định
const form = reactive({
  employeeName: '',
  employeeCode: '',
  department: '',
  fromDate: '',
  toDate: '',
  days: 1,
  reason: '',
  status: 'Chờ duyệt'
})

// Inline validation errors
const errors = reactive({ employeeName: '', employeeCode: '', fromDate: '', toDate: '' })

// Danh sách nhân viên để gợi ý khi nhập tên
const employees = ref<any[]>([])
const query = ref('')
const suggestions = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return []
  return employees.value.filter(e => (e.name || e.employeeCode || e.employeeName || '').toString().toLowerCase().includes(q)).slice(0,8)
})
const showSuggestions = ref(false)

onMounted(async () => {
  try {
    employees.value = await $fetch('/data/employees.json')
  } catch (e) {
    employees.value = []
  }
})
// Theo dõi thay đổi của props.item để cập nhật form khi chỉnh sửa hoặc reset khi tạo mới
watch(() => props.item, (v) => {
  if (v) {
    form.employeeName = v.employeeName || ''
    form.employeeCode = v.employeeCode || ''
    form.department = v.department || ''
    form.fromDate = v.fromDate || ''
    form.toDate = v.toDate || ''
    form.days = v.days || 1
    form.reason = v.reason || ''
    form.status = v.status || 'Chờ duyệt'
  } else {
    form.employeeName = ''
    form.employeeCode = ''
    form.department = ''
    form.fromDate = ''
    form.toDate = ''
    form.days = 1
    form.reason = ''
    form.status = 'Chờ duyệt'
  }
}, { immediate: true })// Thêm immediate: true để chạy ngay khi component được tạo
// Xác định xem đang ở chế độ chỉnh sửa hay tạo mới
const isEdit = computed(() => !!props.item)
// Tính số ngày từ fromDate và toDate (bao gồm cả hai đầu)
function computeDays(from: string, to: string) {
  if (!from || !to) return 1
  const f = new Date(from)
  const t = new Date(to)
  // Đặt giờ về giữa trưa để tránh lỗi do múi giờ khi tính toán
  f.setHours(12,0,0,0); t.setHours(12,0,0,0)
  const diff = Math.round((t.getTime() - f.getTime()) / (24 * 3600 * 1000))
  return diff >= 0 ? diff + 1 : 1
}

// cập nhật days khi from/to thay đổi
watch(() => [form.fromDate, form.toDate], ([from, to]) => {
  if (from && to) {
    const fDate = new Date(from)
    const tDate = new Date(to)
    if (tDate < fDate) {
      // nếu to < from thì đặt to = from
      form.toDate = from
    }
    form.days = computeDays(form.fromDate, form.toDate)
  } else {
    form.days = 1
  }
})
// Hàm xử lý khi người dùng chọn một gợi ý nhân viên từ danh sách
function pickSuggestion(emp: any) {
  form.employeeName = emp.name || emp.employeeName || ''
  form.employeeCode = emp.employeeCode || ''
  form.department = emp.department || ''
  showSuggestions.value = false
}
// Hàm xử lý khi người dùng nhập vào trường tên để hiển thị gợi ý
function onNameInput() {
  query.value = form.employeeName
  showSuggestions.value = !!query.value
}

// Ham xử lý khi người dùng nhấn nút tạo hoặc lưu
function submit(){
  // validate các trường bắt buộc (inline)
  errors.employeeName = ''
  errors.employeeCode = ''
  errors.fromDate = ''
  errors.toDate = ''
  let ok = true
  if (!form.employeeName) { errors.employeeName = 'Họ và tên là bắt buộc'; ok = false }
  if (!form.employeeCode) { errors.employeeCode = 'Mã nhân viên là bắt buộc'; ok = false }
  if (!form.fromDate) { errors.fromDate = 'Chọn Từ ngày'; ok = false }
  if (!form.toDate) { errors.toDate = 'Chọn Đến ngày'; ok = false }
  if (!ok) return

  // Với thao tác tạo mới, ép trạng thái về 'Chờ duyệt'
  const payload = {
    employeeName: form.employeeName,
    employeeCode: form.employeeCode,
    department: form.department,
    fromDate: form.fromDate,
    toDate: form.toDate,
    days: form.days,
    reason: form.reason,
    status: isEdit.value ? form.status : 'Chờ duyệt'
  }

  if (isEdit.value && props.item && props.item.id) {
    emit('update', { id: props.item.id, patch: payload })
  } else {
    emit('create', payload)
  }
}
</script>

<style scoped></style>
