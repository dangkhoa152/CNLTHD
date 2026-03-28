<template>
  <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
    <td class="px-4 py-2 text-gray-900 dark:text-gray-100">{{ item.id }}</td>
    <td class="px-4 py-2 text-gray-900 dark:text-gray-100">{{ item.employeeCode }}</td>
    <td class="px-4 py-2 text-gray-900 dark:text-gray-100">{{ item.name }}</td>
    <td class="px-4 py-2 text-center text-gray-900 dark:text-gray-100">{{ item.history[0].department }}</td>
    <td class="px-4 py-2 text-gray-900 dark:text-gray-100">{{ item.history[0].position }}</td>
    <td class="px-4 py-2 text-center">
      <span :class="statusClass(item.status)" class="px-2 py-1 rounded text-sm text-center">{{ item.status }}</span>
    </td>
    <td class="px-4 py-2 text-center">
      <button @click="$emit('view', item)" class="text-blue-600 dark:text-blue-200 mr-2 rounded">Xem</button>
      <button @click.stop="$emit('edit', item)" class="text-yellow-600 dark:text-yellow-200 mr-2 rounded ">Sửa</button>
      <button @click.stop="$emit('delete', item)" class="text-red-600 dark:text-red-200 rounded">Xóa</button>
    </td>
  </tr>
</template>

<script setup>
// Khai báo props để lấy danh sách nhân viên
const props = defineProps({ item: { type: Object, required: true }})
function statusClass(s) {
  if (s === 'Đang làm việc') return 'text-green-700 dark:text-green-300'
  if (s === 'Nghỉ việc') return 'text-red-700 dark:text-red-300'
  return 'text-yellow-700 dark:text-yellow-300'
}
</script>

<style scoped></style>
