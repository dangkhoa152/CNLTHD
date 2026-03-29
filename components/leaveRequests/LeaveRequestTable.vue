<template>
  <div class="bg-white dark:bg-gray-800 rounded shadow-sm overflow-x-auto">
    <div class="p-3 flex items-center gap-2">
      <button @click="bulkApprove" :disabled="selectedIds.size===0" class="px-3 py-1 bg-green-600 text-white rounded disabled:opacity-50">Duyệt hàng loạt</button>
      <button @click="bulkReject" :disabled="selectedIds.size===0" class="px-3 py-1 bg-red-600 text-white rounded disabled:opacity-50">Từ chối hàng loạt</button>
      <div class="text-sm text-gray-500 ml-2">Đã chọn: {{ selectedIds.size }}</div>
    </div>
    <table class="min-w-full divide-y">
      <thead class="bg-gray-50 dark:bg-gray-700">
        <tr>
          <th class="text-left px-4 py-2 text-gray-700 dark:text-gray-200"><input type="checkbox" :checked="allSelected" @change="toggleAll($event.target.checked)" /></th>
          <th class="text-left px-4 py-2 text-gray-700 dark:text-gray-200">ID</th>
          <th @click="$emit('sort', 'employeeCode')" class="px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors">
            <div class="flex gap-1">
              Mã nhân viên
              <SortIcon column="employeeCode" :sortColumn="sortColumn" :sortOrder="sortOrder || ''"/>
            </div>
          </th>
          <th class="text-left px-4 py-2 text-gray-700 dark:text-gray-200">Tên nhân viên</th>
          <th class="text-left px-4 py-2 text-gray-700 dark:text-gray-200">Phòng ban</th>
          <th @click="$emit('sort', 'fromDate')" class="px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors">
            <div class="flex gap-1">
              Ngày bắt dầu
              <SortIcon column="fromDate" :sortColumn="sortColumn" :sortOrder="sortOrder || ''"/>
            </div>
          </th>
          <th @click="$emit('sort', 'toDate')" class="px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors">
            <div class="flex gap-1">
              Ngày kết thúc
              <SortIcon column="toDate" :sortColumn="sortColumn" :sortOrder="sortOrder || ''"/>
            </div>
          </th>
          <th class="text-left px-4 py-2 text-gray-700 dark:text-gray-200">Trạng thái</th>
          <th class="px-4 py-2 text-gray-700 dark:text-gray-200">Hành động</th>
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
