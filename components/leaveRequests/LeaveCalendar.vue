<template>
    <div class="bg-white dark:bg-gray-800 p-4 rounded shadow-sm">
        <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
                <button @click="prev" class="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded">‹</button>
                <div class="font-semibold">{{ title }}</div>
                <button @click="next" class="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded">›</button>
            </div>
            <div class="flex items-center gap-2">
                <button @click="view = 'month'"
                    :class="view === 'month' ? 'bg-blue-600 text-white px-3 py-1 rounded' : 'px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded'">Tháng</button>
                <button @click="view = 'week'"
                    :class="view === 'week' ? 'bg-blue-600 text-white px-3 py-1 rounded' : 'px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded'">Tuần</button>
            </div>
        </div>

        <div v-if="view === 'month'" class="calendar-month">
            <div class="grid grid-cols-7 gap-1 text-sm text-gray-600 dark:text-gray-300 mb-2">
                <div class="text-center">T2</div>
                <div class="text-center">T3</div>
                <div class="text-center">T4</div>
                <div class="text-center">T5</div>
                <div class="text-center">T6</div>
                <div class="text-center">T7</div>
                <div class="text-center">CN</div>
            </div>

            <div class="grid grid-cols-7 gap-1">
                <div v-for="day in monthGrid" :key="day.key"
                    class="min-h-[90px] border rounded p-1 bg-gray-50 dark:bg-gray-900">
                    <div class="text-xs text-gray-500">{{ day.date.getDate() }}</div>
                    <div class="mt-1 flex flex-col gap-1">
                        <div v-for="ev in eventsForDate(day.date)" :key="ev.id"
                            class="text-xs bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 rounded px-1 py-0.5 truncate">
                            {{ ev.employeeCode }} - {{ ev.employeeName }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="calendar-week">
            <div class="grid grid-cols-7 gap-1 text-sm text-gray-600 dark:text-gray-300 mb-2">
                <div v-for="d of weekDays" :key="d" class="text-center">{{ d }}</div>
            </div>
            <div class="grid grid-cols-7 gap-1">
                <div v-for="date in weekGrid" :key="date.toISOString()"
                    class="min-h-[140px] border rounded p-1 bg-gray-50 dark:bg-gray-900">
                    <div class="text-xs text-gray-500">{{ date.getDate() }}</div>
                    <div class="mt-1 flex flex-col gap-1">
                        <div v-for="ev in eventsForDate(date)" :key="ev.id + '-' + date.toDateString()"
                            class="text-xs bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 rounded px-1 py-0.5 truncate">
                            {{ ev.employeeCode }} - {{ ev.employeeName }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
// Định nghĩa props nhận vào danh sách sự kiện nghỉ phép đã được duyệt
const props = defineProps<{ events: Array<any> }>()
// Trạng thái hiển thị: tháng hoặc tuần
const view = ref<'month' | 'week'>('month')
// Cursor để xác định tháng/tuần hiện tại đang xem
const cursor = ref(new Date())
// Hàm để lấy ngày đầu tiên của tháng
function startOfMonth(d: Date) {
    return new Date(d.getFullYear(), d.getMonth(), 1)
}
// Hàm để lấy ngày cuối cùng của tháng
function endOfMonth(d: Date) {
    return new Date(d.getFullYear(), d.getMonth() + 1, 0)
}
// Hàm để lấy ngày đầu tiên của tuần (theo chuẩn Monday)
function startOfWeek(d: Date) { // Monday
    const day = d.getDay() || 7
    const diff = day - 1
    const res = new Date(d)
    res.setDate(d.getDate() - diff)
    res.setHours(0, 0, 0, 0)
    return res
}
// Computed property để hiển thị tiêu đề tháng hoặc tuần dựa trên cursor
const title = computed(() => {
    if (view.value === 'month') return cursor.value.toLocaleString('default', { month: 'long', year: 'numeric' })
    const start = startOfWeek(cursor.value)
    const end = new Date(start); end.setDate(start.getDate() + 6)
    return `${start.toLocaleDateString()} — ${end.toLocaleDateString()}`
})
// Computed property để tạo lưới ngày cho chế độ xem tháng
const monthGrid = computed(() => {
    const start = startOfWeek(startOfMonth(cursor.value))
    const end = endOfMonth(cursor.value)
    const last = startOfWeek(end)
    // Tạo một mảng các ngày từ ngày bắt đầu đến ngày kết thúc, đảm bảo bao phủ cả tuần chứa ngày cuối cùng của tháng
    const days: Array<{ date: Date, key: string }> = []
    const iter = new Date(start)
    while (iter <= end || iter <= last) {
        days.push({ date: new Date(iter), key: iter.toISOString() })
        iter.setDate(iter.getDate() + 1)
    }
    return days
})
// Computed property để tạo lưới ngày cho chế độ xem tuần
const weekGrid = computed(() => {
    const start = startOfWeek(cursor.value)
    const arr: Date[] = []
    for (let i = 0; i < 7; i++) {
        const d = new Date(start)
        d.setDate(start.getDate() + i)
        arr.push(d)
    }
    return arr
})

const weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
// Hàm so sánh hai ngày chỉ dựa trên năm, tháng, ngày (không so sánh giờ phút giây)
function dateEq(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}
// Hàm để lấy danh sách sự kiện nghỉ phép trùng với một ngày cụ thể
function eventsForDate(d: Date) {
    const list = (props.events || []).filter(ev => {
        if (!ev.fromDate) return false
        const from = new Date(ev.fromDate)
        const to = ev.toDate ? new Date(ev.toDate) : from
        from.setHours(0, 0, 0, 0); to.setHours(23, 59, 59, 999)
        return d >= from && d <= to
    })
    return list
}
// Hàm để chuyển sang tháng hoặc tuần trước đó
function prev() {
    if (view.value === 'month') {
        const d = new Date(cursor.value)
        d.setMonth(d.getMonth() - 1)
        cursor.value = new Date(d)
    } else {
        const d = new Date(cursor.value)
        d.setDate(d.getDate() - 7)
        cursor.value = new Date(d)
    }
}
// Hàm để chuyển sang tháng hoặc tuần tiếp theo
function next() {
    if (view.value === 'month') {
        const d = new Date(cursor.value)
        d.setMonth(d.getMonth() + 1)
        cursor.value = new Date(d)
    } else {
        const d = new Date(cursor.value)
        d.setDate(d.getDate() + 7)
        cursor.value = new Date(d)
    }
}
// Watcher để reset cursor về ngày hiện tại khi chuyển đổi giữa chế độ xem tháng và tuần
watch(view, (v) => { cursor.value = new Date() })
</script>

<style scoped>
.calendar-month>.grid>div {
    min-height: 90px
}
</style>
