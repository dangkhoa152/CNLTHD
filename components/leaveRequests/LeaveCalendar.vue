<template>
  <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
    <!-- HEADER: Điều hướng & Bộ lọc -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">

      <!-- Nhóm điều hướng thời gian -->
      <div class="flex items-center gap-3">
        <div class="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
          <button @click="prev" class="p-1.5 hover:bg-white dark:hover:bg-gray-600 rounded-md transition-all shadow-sm">
            <
          </button>
          <button @click="goToToday"
            class="px-3 text-sm font-medium hover:bg-white dark:hover:bg-gray-600 rounded-md transition-all">Hôm nay
          </button>
          <button @click="next" class="p-1.5 hover:bg-white dark:hover:bg-gray-600 rounded-md transition-all shadow-sm">
            >
          </button>
        </div>
        <h2 class="text-xl font-bold text-gray-800 dark:text-white min-w-[150px]">{{ title }}</h2>
      </div>

      <!-- Nhóm Bộ lọc & Chế độ xem -->
      <div class="flex flex-wrap items-center gap-3">
        <div class="relative">
          <FormInput v-model="searchQuery" type="text" placeholder="Tìm mã hoặc tên..."
            class="!pl-10 !py-2 !md:w-64" />
        </div>
        <div class="relative">
          <FormSelect v-model="department" placeholder="Tất cả phòng ban"
           :options="props.departments.map(dep => ({ value: dep.name, label: dep.name }))"
           />
        </div>

        <!-- Chế độ xem Month/Week -->
        <div class="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
          <button @click="view = 'month'"
            :class="view === 'month' ? 'bg-white dark:bg-gray-600 shadow text-blue-400' : 'text-gray-500'"
            class="px-4 py-1.5 text-sm font-medium rounded-md transition-all">Tháng</button>
          <button @click="view = 'week'"
            :class="view === 'week' ? 'bg-white dark:bg-gray-600 shadow text-blue-400' : 'text-gray-500'"
            class="px-4 py-1.5 text-sm font-medium rounded-md transition-all">Tuần</button>
        </div>
      </div>
    </div>

    <!-- CALENDAR GRID -->
    <div class="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
      <div class="grid grid-cols-7 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div v-for="d in weekDays" :key="d"
          class="py-3 text-center text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          {{ d }}
        </div>
      </div>

      <!-- Month View -->
      <div v-if="view === 'month'" class="grid grid-cols-7">
        <div v-for="day in monthGrid" :key="day.key" :class="[
          'min-h-[110px] p-2 border-r border-b border-gray-100 dark:border-gray-700 transition-colors',
          isToday(day.date) ? 'bg-blue-50/30 dark:bg-blue-900/10' : 'bg-white dark:bg-gray-900',
          !isSameMonth(day.date) ? 'opacity-40' : ''
        ]">
          <div class="flex justify-between items-start mb-2">
            <span :class="['text-xs font-semibold mb-2 flex justify-center items-center w-7 h-7 rounded-full', isToday(day.date) ? 'bg-blue-600 text-white' : 'text-gray-500']">
              {{ day.date.getDate() }} 
            </span>

            <span v-if="checkDepartmentCapacity(department, day.date,props.events)" 
              class="text-red-500 text-xs font-bold bg-red-100 px-2 py-0.5 rounded-md">
              ⚠️ Quá tải
            </span>
          </div>

          <div class="space-y-1">
            <template v-if="!isWeekend(day.date)">
              <div v-for="ev in eventsForDate(day.date)" :key="ev.id"
                class="group relative flex items-center px-2 py-1 text-[10px] font-medium bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded border border-emerald-100 dark:border-emerald-800 transition-all hover:scale-[1.02] cursor-default">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                <span class="truncate">{{ ev.employeeCode }} - {{ ev.employeeName }}</span>
                <div class="absolute z-10 hidden group-hover:block bg-gray-900 text-white p-2 rounded shadow-lg -top-10 left-0 whitespace-nowrap text-xs">
                  {{ ev.employeeName }} ({{ ev.department || 'Nghỉ phép' }})
                </div>
              </div>
            </template>

            <template v-else>
              <div class="text-[10px] text-center text-gray-400 dark:text-gray-600 font-medium italic mt-2">
                Nghỉ cuối tuần
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- Week View -->
      <div v-else class="grid grid-cols-7 h-full">
        <div v-for="date in weekGrid" :key="date.toISOString()"
          :class="['min-h-[300px] p-4 border-r border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900', isToday(date) ? 'bg-blue-50/20' : '']">
          <div
            :class="['text-sm font-bold mb-4 text-center pb-2 border-b', isToday(date) ? 'text-blue-600 border-blue-200' : 'text-gray-400 border-gray-100 dark:border-gray-800']">
            {{ date.getDate() }}
          </div>
          <div class="space-y-2">
            <template v-if="!isWeekend(date)">
              <div v-for="ev in eventsForDate(date)" :key="ev.id + '-' + date.toDateString()"
                class="p-2 text-xs bg-emerald-100 dark:bg-emerald-800/40 text-emerald-800 dark:text-emerald-100 rounded-lg shadow-sm border-l-4 border-emerald-500">
                <div class="font-bold">{{ ev.employeeCode }}</div>
                <div class="truncate">{{ ev.employeeName }}</div>
              </div>
            </template>

            <template v-else>
              <div
                class="text-xs text-center text-gray-600 dark:text-gray-200 mt-4 bg-gray-50 dark:bg-gray-800 py-2 rounded-lg border border-dashed border-gray-200 dark:border-gray-700">
                Ngày nghỉ cuối tuần
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import getNowString from '@/utils/formatDate'
const props = defineProps({
  events: { type: Array, default: () => [] },
  departments: { type: Array, default: () => [] }
})

const department = ref('') // State để lưu phòng
const view = ref('month')
const cursor = ref(new Date()) // State để theo dõi ngày của tháng/tuần hiện tại đang hiển thị
const searchQuery = ref('') // State cho bộ lọc
const weekDays = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN']

// --- LOGIC LỌC DỮ LIỆU ---
const filteredEvents = computed(() => {
  const query = searchQuery.value.toLowerCase().trim() 
  if (!query) return props.events
  return props.events.filter(ev =>
    ev.employeeName.toLowerCase().includes(query) ||
    ev.employeeCode.toLowerCase().includes(query)
  )
})

// --- HELPER FUNCTIONS ---
const isToday = (date) => {
  const today = new Date()
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
}

const isSameMonth = (date) => date.getMonth() === cursor.value.getMonth()

function startOfMonth(d) { 
  return new Date(d.getFullYear(), d.getMonth(), 1) 
} // Lấy ngày đầu tháng

function endOfMonth(d) { 
  return new Date(d.getFullYear(), d.getMonth() + 1, 0) 
} // Lấy ngày cuối tháng

function startOfWeek(d) {
  const day = d.getDay() || 7
  const diff = day - 1
  const res = new Date(d)
  res.setDate(d.getDate() - diff)
  res.setHours(0, 0, 0, 0)
  return res
}

const isWeekend = (date) => {
  const day = date.getDay()
  return day === 0 || day === 6 // 0 là Chủ Nhật, 6 là Thứ 7
}

// --- COMPUTED GRID ---
const title = computed(() => {
  if (view.value === 'month') return cursor.value.toLocaleString('vi-VN', { month: 'long', year: 'numeric' })
  const start = startOfWeek(cursor.value)
  const end = new Date(start); 
  end.setDate(start.getDate() + 6)
  return `T${start.getMonth() + 1} ${start.getDate()} - ${end.getDate()}`
})
// Tạo mảng ngày cho chế độ xem tháng
const monthGrid = computed(() => {
  const start = startOfWeek(startOfMonth(cursor.value)) 
  const end = endOfMonth(cursor.value)
  const last = startOfWeek(end)
  const days = []
  const iter = new Date(start)
  while (iter <= end || iter <= last) {
    days.push({ date: new Date(iter), key: iter.toISOString() })
    iter.setDate(iter.getDate() + 1)
  }
  return days
})
// Tạo mảng ngày cho chế độ xem tuần
const weekGrid = computed(() => {
  const start = startOfWeek(cursor.value)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    return d
  })
})
// Kiểm tra nhân viên có được nghỉ vào ngày d hay không
function eventsForDate(d) {
  return filteredEvents.value.filter(ev => {
    if (!ev.fromDate) return false
    const from = new Date(ev.fromDate)
    const to = ev.toDate ? new Date(ev.toDate) : from
    from.setHours(0, 0, 0, 0)
    to.setHours(23, 59, 59, 999)
    return d >= from && d <= to
  })
}

 function checkDepartmentCapacity(departmentName, checkDate, leaveRequestsList){
    let count = 0;
    if (!leaveRequestsList || leaveRequestsList.length === 0) return false;
    for (const leave of leaveRequestsList) {
        if (leave.department === departmentName) {
            const from = getNowString(leave.fromDate);
            const to = getNowString(leave.toDate);
            const check = getNowString(checkDate);
            if (from <= check && check <= to) {
                count++;
            }
        }
    } 
    return count>=2;
}
// --- NAVIGATION ---
const prev = () => {
  const d = new Date(cursor.value)
  view.value === 'month' ? d.setMonth(d.getMonth() - 1) : d.setDate(d.getDate() - 7)
  cursor.value = d
}
const next = () => {
  const d = new Date(cursor.value)
  view.value === 'month' ? d.setMonth(d.getMonth() + 1) : d.setDate(d.getDate() + 7)
  cursor.value = d
}
const goToToday = () => { cursor.value = new Date() }
// Khi người dùng thay đổi chế độ xem, tự động chuyển về tháng/tuần hiện tại để tránh việc hiển thị dữ liệu trống
watch(view, () => { 
  cursor.value = new Date() 
})
</script>