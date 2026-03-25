<template>
  <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
    <td class="px-4 py-2 text-gray-900 dark:text-gray-100">{{ item.id }}</td>
    <td class="px-4 py-2 text-gray-900 dark:text-gray-100">{{ item.employeeName }}</td>
    <td class="px-4 py-2 text-gray-900 dark:text-gray-100">{{ item.employeeCode }}</td>
    <td class="px-4 py-2 text-gray-900 dark:text-gray-100">{{ item.department }}</td>
    <td class="px-4 py-2 text-gray-900 dark:text-gray-100">{{ item.fromDate }} → {{ item.toDate }}</td>
    <td class="px-4 py-2 text-gray-900 dark:text-gray-100">{{ item.days }}</td>
    <td class="px-4 py-2 truncate max-w-xs text-gray-900 dark:text-gray-100">{{ item.reason }}</td>
    <td class="px-4 py-2">
      <span :class="statusClass(item.status)" class="px-2 py-1 rounded text-sm text-center">{{ item.status }}</span>
    </td>
    <td class="px-4 py-2 text-center">
      <button @click="$emit('view', item)" class="text-blue-600 dark:text-blue-200 mr-2 rounded">Xem</button>
      <button @click="$emit('edit', item)" class="text-yellow-600 dark:text-yellow-200 mr-2 rounded ">Sửa</button>
      <button @click="$emit('delete', item)" class="text-red-600 dark:text-red-200 rounded">Xóa</button>
    </td>
  </tr>
</template>

<script setup>
// Khai báo props để lấy danh sách đơn nghỉ phép
const props = defineProps({ item: { type: Object, required: true } })
function statusClass(s) {
  if (s === 'Đã duyệt') return 'text-green-700 dark:text-green-300'
  if (s === 'Đã từ chối') return 'text-red-700 dark:text-red-300'
  return 'text-yellow-700 dark:text-yellow-300'
}
</script>

<style scoped></style>
