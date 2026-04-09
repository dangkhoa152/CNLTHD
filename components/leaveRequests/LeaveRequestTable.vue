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
    <table class="min-w-full table-fixed divide-y border-separate border-spacing-y-2">
      <thead class="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
        <tr>
          <th class="w-16 text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300"><input type="checkbox" :checked="allSelected" @change="toggleAll($event.target.checked)" class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" /></th>
          <th @click="$emit('sort', 'id')" class="w-12 px-4 py-3 cursor-pointer text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <div class="flex items-center gap-1">
              ID
              <SortIcon column="id" :sortColumn="sortColumn" :sortOrder="sortOrder || ''"/>
            </div>
          </th>
          <th @click="$emit('sort', 'employeeCode')" class="w-28 px-4 py-3 cursor-pointer text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <div class="flex items-center gap-1">
              Mã nhân viên
              <SortIcon column="employeeCode" :sortColumn="sortColumn" :sortOrder="sortOrder || ''"/>
            </div>
          </th>
          <th @click="$emit('sort', 'employeeName')" class="w-40 text-left px-4 py-3 cursor-pointer text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300">
             <div class="flex items-center gap-1">
              Tên nhân viên
              <SortIcon column="employeeName" :sortColumn="sortColumn" :sortOrder="sortOrder || ''"/>
            </div>
          </th>
          <th class="w-56 text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300">Phòng ban</th>
          <th @click="$emit('sort', 'createdAt')" class="w-24 px-4 py-3 cursor-pointer text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <div class="flex items-center gap-1">
              Ngày gửi
              <SortIcon column="createdAt" :sortColumn="sortColumn" :sortOrder="sortOrder || ''"/>
            </div>
          </th>
          <th @click="$emit('sort', 'reason')" class="w-48 px-4 py-3 cursor-pointer text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <div class="flex items-center gap-1">
              Lý do
              <SortIcon column="reason" :sortColumn="sortColumn" :sortOrder="sortOrder || ''"/>
            </div>
          </th>
          <th class="w-32 text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300">Trạng thái</th>
          <th class="w-32 text-center px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300">Hành động</th>
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
import { ref, computed, watch } from 'vue'

//Khởi tạo props để nhận dữ liệu từ component cha và định nghĩa các sự kiện để giao tiếp với component cha
const props = defineProps({ 
  items: { type: Array, default: () => [] }, 
  sortColumn: { type: String, default: '' },
  sortOrder: { type: String, default: '' },
  resetSelectionCounter: { type: Number, default: 0 }
})
const emit = defineEmits(['view','edit','delete','bulk-approve','bulk-reject','selection-changed', 'sort'])

const selectedIds = ref(new Set())
// Hàm xử lý khi người dùng chọn hoặc bỏ chọn một checkbox của đơn nghỉ phép
function toggleSelect(id, checked) {
  if (checked) selectedIds.value.add(id)
  else selectedIds.value.delete(id)
  emit('selection-changed', Array.from(selectedIds.value))
}
// Computed property để kiểm tra xem tất cả các mục có được chọn hay không, dùng để điều khiển checkbox "Chọn tất cả"
const allSelected = computed(() => props.items.length > 0 && props.items.every(i => selectedIds.value.has(i.id)))

watch(() => props.resetSelectionCounter, (current, previous) => {
  if (previous !== undefined && current !== previous) {
    selectedIds.value.clear()
    emit('selection-changed', [])
  }
})

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
}
// Hàm xử lý khi người dùng nhấn nút "Từ chối hàng loạt"
function bulkReject() {
  if (selectedIds.value.size === 0) return
  emit('bulk-reject', Array.from(selectedIds.value))
}
</script>

<style scoped></style>
