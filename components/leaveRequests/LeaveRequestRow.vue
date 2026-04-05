<template>
  <tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
    <td class="px-4 py-3">
      <input type="checkbox" :checked="selected" @change="$emit('toggle-select', item.id, $event.target.checked)" class="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
    </td>
    <td class="px-4 py-3 text-gray-900 dark:text-gray-100">{{ item.id }}</td>
    <td class="px-4 py-3 text-gray-900 dark:text-gray-100">{{ item.employeeCode }}</td>
    <td class="px-4 py-3 text-gray-900 dark:text-gray-100">{{ item.employeeName }}</td>
    <td class="px-4 py-3 text-gray-900 dark:text-gray-100">{{ item.department }}</td>
    <td class="px-4 py-3 text-gray-900 dark:text-gray-100">{{ getNowString(item.createdAt) }}</td>
    <td class="px-4 py-3 text-gray-900 dark:text-gray-100">{{ item.reason }}</td>
    <td class="px-4 py-3">
      <span :class="statusClass(item.status)" class="inline-flex items-center justify-center rounded-full px-3 py-1 text-sm font-semibold">{{ item.status }}</span>
    </td>
    <td class="px-4 py-3 text-center space-x-1">
      <button @click="$emit('view', item)" class="text-blue-600 dark:text-blue-200 font-semibold hover:text-blue-800 dark:hover:text-blue-300">Xem</button>
      <button @click="$emit('edit', item)" class="text-amber-600 dark:text-amber-200 font-semibold hover:text-amber-800 dark:hover:text-amber-300">Sửa</button>
      <button @click="$emit('delete', item)" class="text-red-600 dark:text-red-200 font-semibold hover:text-red-800 dark:hover:text-red-300">Xóa</button>
    </td>
  </tr>
</template>

<script setup>
import getNowString from '@/utils/formatDate'
// Khai báo props để lấy danh sách đơn nghỉ phép
const props = defineProps({ item: { type: Object, required: true }, selected: { type: Boolean, default: false } })
function statusClass(s) {
  if (s === 'Đã duyệt') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
  if (s === 'Từ chối') return 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
  return 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
}
</script>

<style scoped></style>
