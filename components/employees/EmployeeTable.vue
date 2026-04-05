<template>
  <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-sm overflow-x-auto border border-gray-200 dark:border-gray-700">
    <table class="min-w-full table-fixed divide-y border-separate border-spacing-y-2">
      <thead class="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
        <tr>
          <th class="w-16 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">ID</th>
          <th @click="$emit('sort', 'employeeCode')" class="w-28 px-4 py-3 cursor-pointer text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <div class="flex items-center gap-1">
              Mã nhân viên
              <SortIcon column="employeeCode" :sortColumn="sortColumn" :sortOrder="sortOrder || ''"/>
            </div>
          </th>
          <th @click="$emit('sort', 'name')" class="w-32 px-4 py-3 cursor-pointer text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <div class="flex items-center gap-1">
              Tên nhân viên
              <SortIcon column="name" :sortColumn="sortColumn" :sortOrder="sortOrder || ''" />
            </div>
          </th>
          <th class="w-56 px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">Phòng ban</th>
          <th @click="$emit('sort', 'position')" class="w-32 px-4 py-3 cursor-pointer text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <div class="flex items-center gap-1">
              Chức vụ
              <SortIcon column="position" :sortColumn="sortColumn" :sortOrder="sortOrder || ''" />
            </div>
          </th>
          <th class="w-24 px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">Trạng thái</th>
          <th class="w-32 px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">Hành động</th>
        </tr>
      </thead>

      <tbody class="bg-white dark:bg-gray-800 divide-y dark:divide-gray-700">
        <EmployeeRow v-for="it in items" 
          :item="it" 
          @view="$emit('view', $event)" 
          @edit="$emit('edit', $event)"
          @delete="$emit('delete', $event)" />
        <tr v-if="items.length === 0">
          <td class="px-4 py-6 text-center" colspan="7">Không có dữ liệu</td>
        </tr>
      </tbody>

    </table>
  </div>
</template>

<script setup>
import EmployeeRow from './EmployeeRow.vue'
import SortIcon from '../common/SortIcon.vue'
import { ref, computed } from 'vue'

// Khởi tạo props để nhận dữ liệu từ component cha và định nghĩa các sự kiện để giao tiếp với component cha
//  khi người dùng thực hiện các hành động như xem, duyệt hoặc từ chối đơn nghỉ phép.
const props = defineProps({ 
  items: { type: Array, default: () => [] },
  sortColumn: { type: String, default: '' },
  sortOrder: { type: String, default: '' }    
})

const emit = defineEmits(['view', 'edit', 'delete', 'sort'])


</script>

<style scoped></style>
