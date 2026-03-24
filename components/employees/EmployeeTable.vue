<template>
  <div class="bg-white dark:bg-gray-800 rounded shadow-sm overflow-x-auto">
    <table class="min-w-full divide-y">
      <thead class="bg-gray-50 dark:bg-gray-700">
        <tr>
          <th class="text-left px-4 py-2 text-gray-700 dark:text-gray-200">ID</th>
          <th class="text-left px-4 py-2 text-gray-700 dark:text-gray-200">Mã nhân viên</th>
          <th class="text-left px-4 py-2 text-gray-700 dark:text-gray-200">Tên nhân viên</th>
          <th class="text-left px-4 py-2 text-gray-700 dark:text-gray-200">Phòng ban</th>
          <th class="text-left px-4 py-2 text-gray-700 dark:text-gray-200">Chức vụ</th>
          <th class="text-left px-4 py-2 text-gray-700 dark:text-gray-200">Trạng thái</th>
          <th class="px-4 py-2 text-gray-700 dark:text-gray-200">Hành động</th>
        </tr>
      </thead>
      <tbody class="bg-white dark:bg-gray-800 divide-y dark:divide-gray-700">
        <EmployeeRow
          v-for="it in items"
          :item="it"
          @view="$emit('view', $event)"
          @edit="$emit('edit', $event)"
          @delete="$emit('delete', $event)"
        />
        <tr v-if="items.length===0">
          <td class="px-4 py-6 text-center" colspan="7">Không có dữ liệu</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import EmployeeRow from './EmployeeRow.vue'
// Khởi tạo props để nhận dữ liệu từ component cha và định nghĩa các sự kiện để giao tiếp với component cha
//  khi người dùng thực hiện các hành động như xem, duyệt hoặc từ chối đơn nghỉ phép.
const props = defineProps({ items: { type: Array, default: () => [] } })
const emit = defineEmits(['view','edit','delete'])

import { ref, computed } from 'vue'

</script>

<style scoped></style>
