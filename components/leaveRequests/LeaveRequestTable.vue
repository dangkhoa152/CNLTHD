<template>
  <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-sm overflow-x-auto border border-gray-200 dark:border-gray-700">
    <div class="p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div class="flex flex-wrap items-center gap-2">
        <button @click="bulkApprove" :disabled="selectedIds.size===0" class="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50">
          Duyệt hàng loạt
        </button>
        <button @click="bulkReject" :disabled="selectedIds.size===0" class="inline-flex items-center gap-2 rounded-full bg-rose-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-50">
          Từ chối hàng loạt
        </button>
      </div>
      <div class="text-sm text-slate-500 dark:text-slate-400">Đã chọn: <span class="font-semibold text-slate-700 dark:text-slate-100">{{ selectedIds.size }}</span></div>
    </div>
    <table class="min-w-full divide-y border-separate border-spacing-y-2">
      <thead class="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
        <tr>
          <th class="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300"><input type="checkbox" :checked="allSelected" @change="toggleAll($event.target.checked)" class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" /></th>
          <th class="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300">ID</th>
          <th @click="$emit('sort', 'employeeCode')" class="px-4 py-3 cursor-pointer text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <div class="flex items-center gap-1">
              Mã nhân viên
              <SortIcon column="employeeCode" :sortColumn="sortColumn" :sortOrder="sortOrder || ''"/>
            </div>
          </th>
          <th class="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300">Tên nhân viên</th>
          <th class="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300">Phòng ban</th>
          <th @click="$emit('sort', 'fromDate')" class="px-4 py-3 cursor-pointer text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <div class="flex items-center gap-1">
              Ngày bắt đầu
              <SortIcon column="fromDate" :sortColumn="sortColumn" :sortOrder="sortOrder || ''"/>
            </div>
          </th>
          <th @click="$emit('sort', 'toDate')" class="px-4 py-3 cursor-pointer text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <div class="flex items-center gap-1">
              Ngày kết thúc
              <SortIcon column="toDate" :sortColumn="sortColumn" :sortOrder="sortOrder || ''"/>
            </div>
          </th>
          <th class="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300">Trạng thái</th>
          <th class="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300">Hành động</th>
        </tr>
      </thead>
      <tbody class="bg-white dark:bg-gray-800 divide-y dark:divide-gray-700">
        <LeaveRequestRow
          v-for="it in items"
          :key="it.id"
          :item="it"
          :selected="selectedIds.has(it.id)"
          @view="$emit('view', $event)"
          @edit="$emit('edit', $event)"
          @delete="$emit('delete', $event)"
          @toggle-select="toggleSelect"
        />
        <tr v-if="items.length===0">
          <td class="px-4 py-6 text-center" colspan="8">Không có dữ liệu</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import LeaveRequestRow from './LeaveRequestRow.vue'
import SortIcon from '../common/SortIcon.vue'
//Khởi tạo props để nhận dữ liệu từ component cha và định nghĩa các sự kiện để giao tiếp với component cha
const props = defineProps({ 
  items: { type: Array, default: () => [] }, 
  sortColumn: { type: String, default: '' },
  sortOrder: { type: String, default: '' }
})
const emit = defineEmits(['view','edit','delete','bulk-approve','bulk-reject','selection-changed', 'sort'])

import { ref, computed } from 'vue'

const selectedIds = ref(new Set())
// Hàm xử lý khi người dùng chọn hoặc bỏ chọn một checkbox của đơn nghỉ phép
function toggleSelect(id, checked) {
  if (checked) selectedIds.value.add(id)
  else selectedIds.value.delete(id)
  emit('selection-changed', Array.from(selectedIds.value))
}
// Computed property để kiểm tra xem tất cả các mục có được chọn hay không, dùng để điều khiển checkbox "Chọn tất cả"
const allSelected = computed(() => props.items.length > 0 && props.items.every(i => selectedIds.value.has(i.id)))
// Hàm xử lý khi người dùng nhấn checkbox "Chọn tất cả"
function toggleAll(checked) {
  if (checked) props.items.forEach(i => selectedIds.value.add(i.id))
  else selectedIds.value.clear()
  emit('selection-changed', Array.from(selectedIds.value))
}
// Hàm xử lý khi người dùng nhấn nút "Duyệt hàng loạt"
function bulkApprove() {
  if (selectedIds.value.size === 0) return
  emit('bulk-approve', Array.from(selectedIds.value))
  selectedIds.value.clear()
  emit('selection-changed', [])
}
// Hàm xử lý khi người dùng nhấn nút "Từ chối hàng loạt"
function bulkReject() {
  if (selectedIds.value.size === 0) return
  emit('bulk-reject', Array.from(selectedIds.value))
  selectedIds.value.clear()
  emit('selection-changed', [])
}
</script>

<style scoped></style>
