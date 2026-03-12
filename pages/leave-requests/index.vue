<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Quản lý đơn xin nghỉ phép</h1>
    <LeaveRequestFilter :departments="departments" @filter-changed="onFilter" />

    <div class="my-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-white dark:bg-gray-800 p-4 rounded shadow-sm">
        <div class="text-sm text-gray-500 dark:text-gray-300 font-bold">Tổng đơn</div>
        <div class="text-2xl text-blue-500 dark:text-blue-300 font-bold">{{ filtered.length }}</div>
      </div>
      <div class="bg-white dark:bg-gray-800 p-4 rounded shadow-sm">
        <div class="text-sm text-gray-500 dark:text-gray-300 font-bold">Chờ duyệt</div>
        <div class="text-2xl text-yellow-500 dark:text-yellow-300 font-bold">{{ countFilteredStatus('Chờ duyệt') }}
        </div>
      </div>
      <div class="bg-white dark:bg-gray-800 p-4 rounded shadow-sm">
        <div class="text-sm text-gray-500 dark:text-gray-300 font-bold">Đã duyệt</div>
        <div class="text-2xl text-green-500 dark:text-green-300 font-bold">{{ countFilteredStatus('Đã duyệt') }}</div>
      </div>
      <div class="bg-white dark:bg-gray-800 p-4 rounded shadow-sm">
        <div class="text-sm text-gray-500 dark:text-gray-300 font-bold">Đã từ chối</div>
        <div class="text-2xl text-red-500 dark:text-red-300 font-bold">{{ countFilteredStatus('Đã từ chối') }}</div>
      </div>
    </div>

    <LeaveRequestTable :items="filtered" @view="open" @approve="approve" @reject="reject" />

    <LeaveRequestModal v-if="selected" :item="selected" @close="selected = null" @approve="approve" @reject="reject" />
  </div>
</template>

<script lang="ts" setup>
// import các component con bao gồm bộ lọc, bảng hiển thị và modal chi tiết đơn.
import { ref, onMounted, computed } from 'vue'
import LeaveRequestFilter from '~/components/leaveRequests/LeaveRequestFilter.vue'
import LeaveRequestTable from '~/components/leaveRequests/LeaveRequestTable.vue'
import LeaveRequestModal from '~/components/leaveRequests/LeaveRequestModal.vue'

// khai báo các biến phản ứng để lưu trữ dữ liệu đơn nghỉ phép, trạng thái bộ lọc, đơn được chọn và danh sách phòng ban.
const all = ref([] as any[])
const filter = ref({ query: '', status: '', department: '' })
const selected = ref(null as any | null)

const departments = ref([] as string[])
// lấy data từ file JSON khi component được mounted và xử lý dữ liệu để lấy danh sách phòng ban duy nhất.
onMounted(async () => {
  try {
    const res = await fetch('/data/leave-request.json')
    all.value = await res.json()
    departments.value = Array.from(new Set(all.value.map((i: any) => i.department))).sort()
  } catch (e) {
    console.error('Không thể load dữ liệu đơn nghỉ phép', e)
  }
})
// Hàm xử lý sự kiện khi người dùng thay đổi bộ lọc
function onFilter(payload: any) {
  filter.value = payload
}

const filtered = computed(() => {
  return all.value.filter((it: any) => {
    const q = (filter.value.query || '').toLowerCase()
    if (filter.value.status && it.status !== filter.value.status) return false
    if (filter.value.department && it.department !== filter.value.department) return false
    if (q) {
      return [it.employeeName, it.employeeCode, it.reason].join(' ').toLowerCase().includes(q)
    }
    return true
  })
})
// Hàm đếm số lượng theo bộ lọc
function countFilteredStatus(s: string) {
  return filtered.value.filter((i: any) => i.status === s).length
}
// Hàm mở modal chi tiết
function open(item: any) { selected.value = item }
// Hàm duyệt đơn
function approve(item: any) {
  const t = all.value.find(i => i.id === item.id)
  if (t) t.status = 'Đã duyệt'
  selected.value = null
}
// Hàm từ chối đơn
function reject(item: any) {
  const t = all.value.find(i => i.id === item.id)
  if (t) t.status = 'Đã từ chối'
  selected.value = null
}
</script>

<style></style>