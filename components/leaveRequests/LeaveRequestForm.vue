<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black opacity-40" @click="$emit('close')"></div>
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl p-6 z-10">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-indigo-100 dark:bg-indigo-900
                    text-indigo-700 dark:text-indigo-200 
                    rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 9a3 3 0 100-6 3 3 0 000 6z" />
              <path fill-rule="evenodd"
                d="M2 13.5A6.5 6.5 0 0110.5 7h1A6.5 6.5 0 0118 13.5V15a2 2 0 01-2 2H4a2 2 0 01-2-2v-1.5z"
                clip-rule="evenodd" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold">{{ isEdit ? 'Sửa đơn nghỉ phép' : 'Tạo đơn nghỉ phép' }}</h3>
        </div>
        <FormButton variant="ghost" aria-label="Close" @click="$emit('close')"
          class="!w-8 !h-8 !p-0 !rounded-full !border-0">
          X
        </FormButton>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Người xin <span
              class="text-sm text-red-600">*</span></label>
          <div class="mt-1 flex gap-2 relative">
            <FormInput v-model="form.employeeCode" @input="onNameInput"
              :disabled="isEdit || auth.user?.role === 'employee'" type="text" placeholder="Mã nhân viên"
              :error="errors.employeeCode" :hint="'Nhập mã để hiện gợi ý'" class="!w-36 !rounded-none" />
            <FormInput v-model="form.employeeName" :disabled="isEdit || auth.user?.role === 'employee'" type="text"
              placeholder="Họ và tên" :error="errors.employeeName" class="!w-48 !rounded-none" />
            <FormInput v-model="form.department" :disabled="isEdit || auth.user?.role === 'employee'" type="text"
              placeholder="Phòng ban" class="!flex-1 !rounded-none" />
          </div>

          <div v-if="showSuggestions && suggestions.length"
            class="absolute bg-white dark:bg-gray-800 border max-w-2xl mt-1 rounded shadow z-20">
            <ul>
              <li v-for="s in suggestions" :key="s.employeeCode" @click="pickSuggestion(s)"
                class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">{{ s.employeeCode }} — {{
                s.name }} — {{ s.history[0].department }}</li>
            </ul>
          </div>

        </div>

        <div>
          <FormInput v-model="form.fromDate" type="date" label="Từ ngày" :error="errors.fromDate" required
            class="!rounded-md" />
        </div>
        <div>
          <FormInput v-model="form.toDate" type="date" label="Đến ngày" :error="errors.toDate" required
            class="!rounded-md" />
        </div>
        <FormTextarea v-model="form.reason" label="Lý do" placeholder="Mô tả ngắn gọn lý do nghỉ" rows="3"
          class="!rounded-md !md:col-span-2" />
      </div>

      <div class="mt-6 flex justify-end gap-2">
        <FormButton @click="$emit('close')" variant="secondary" class="!px-4 !py-2 !rounded-md">Hủy</FormButton>
        <FormButton @click="submit" variant="primary" :loading="false" class="!px-4 !py-2 !rounded-md"> {{ isEdit ? 'Lưu' : 'Tạo' }}</FormButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, computed, ref, onMounted } from 'vue'
import { useEmployeeStore } from '@/stores/employeeStore'
import { useAuthStore } from '@/stores/auth'
import { Form } from 'lucide-vue-next'
const auth = useAuthStore()

const props = defineProps({ item: { type: Object, default: null } })
const emit = defineEmits(['close', 'create', 'update'])
const empStore = useEmployeeStore()

const form = reactive({
  employeeName: '',
  employeeCode: '',
  department: '',
  fromDate: '',
  toDate: '',
  days: 1,
  reason: ''
})

const errors = reactive({ employeeName: '', employeeCode: '', fromDate: '', toDate: '' })

// Danh sách nhân viên để gợi ý khi nhập tên
const employees = ref([])
const query = ref('')

const suggestions = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return []
  return employees.value.filter(e =>
    (e.employeeCode || e.name || e.employeeName || '').toString().toLowerCase().includes(q)
  ).slice(0, 8)
})

const showSuggestions = ref(false)

onMounted(async () => {
  try {
    empStore.loadDataFromLocal()
    employees.value = empStore.employees
    if (auth.user?.role === 'employee' && !isEdit.value) {
      const emp = employees.value.find(e => e.employeeCode === auth.user.employeeCode)
      form.employeeName = emp?.name || ''
      form.employeeCode = emp?.employeeCode || ''
      form.department = emp?.history?.[0]?.department || ''
    }
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
  } else {

    form.employeeName = ''
    form.employeeCode = ''
    form.department = ''

  }
}, { immediate: true })

const isEdit = computed(() => !!props.item)

function computeDays(from, to) {
  if (!from || !to) return 1
  const startDate = new Date(from)
  const endDate = new Date(to)
  // Đặt giờ về giữa trưa để tránh lỗi do múi giờ hoặc giờ mùa hè
  startDate.setHours(12, 0, 0, 0)
  endDate.setHours(12, 0, 0, 0)
  if (endDate < startDate) return
  let workingDaysCount = 0
  let currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay()
    // không đếm thứ 7 và chủ nhật
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      workingDaysCount++
    }
    currentDate.setDate(currentDate.getDate() + 1)
  }
  return workingDaysCount > 0 ? workingDaysCount : 0
}

// cập nhật days khi from/to thay đổi
watch(() => [form.fromDate, form.toDate], ([from, to]) => {
  if (from && to) {
    const fDate = new Date(from)
    const tDate = new Date(to)
    if (tDate < fDate) {
      form.toDate = from
    }
    form.days = computeDays(form.fromDate, form.toDate)
  } else {
    form.days = 1
  }
})

// Hàm xử lý khi người dùng chọn một gợi ý nhân viên từ danh sách
function pickSuggestion(emp) {
  form.employeeCode = emp.employeeCode || ''
  form.employeeName = emp.name || emp.employeeName || ''
  form.department = emp.history?.[0]?.department || ''
  showSuggestions.value = false
}

// Hàm xử lý khi người dùng nhập vào trường tên để hiển thị gợi ý
function onNameInput() {
  query.value = form.employeeCode
  showSuggestions.value = !!query.value
}

function submit() {
  errors.employeeName = ''
  errors.employeeCode = ''
  errors.fromDate = ''
  errors.toDate = ''

  let ok = true

  if (!form.employeeName) { errors.employeeName = 'Họ và tên là bắt buộc'; ok = false }
  if (!form.employeeCode) { errors.employeeCode = 'Mã nhân viên là bắt buộc'; ok = false }
  if (!form.fromDate) { errors.fromDate = 'Vui lòng chọn ngày bắt đầu'; ok = false }
  if (!form.toDate) { errors.toDate = 'Vui lòng chọn ngày kết thúc'; ok = false }

  if (!ok) return

  const payload = {
    employeeName: form.employeeName,
    employeeCode: form.employeeCode,
    department: form.department,
    fromDate: form.fromDate,
    toDate: form.toDate,
    days: form.days,
    reason: form.reason
  }

  if (isEdit.value && props.item && props.item.id) {
    emit('update', { id: props.item.id, patch: payload })
  } else {
    emit('create', payload)
  }
}
</script>

<style scoped></style>