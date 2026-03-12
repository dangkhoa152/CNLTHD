<template>
  <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
    <td class="px-4 py-2 text-gray-900 dark:text-gray-100">{{ item.employeeName }}</td>
    <td class="px-4 py-2 text-gray-900 dark:text-gray-100">{{ item.employeeCode }}</td>
    <td class="px-4 py-2 text-gray-900 dark:text-gray-100">{{ item.department }}</td>
    <td class="px-4 py-2 text-gray-900 dark:text-gray-100">{{ item.fromDate }} → {{ item.toDate }}</td>
    <td class="px-4 py-2 text-gray-900 dark:text-gray-100">{{ item.days }}</td>
    <td class="px-4 py-2 truncate max-w-xs text-gray-900 dark:text-gray-100">{{ item.reason }}</td>
    <td class="px-4 py-2">
      <span :class="statusClass(item.status)" class="px-2 py-1 rounded text-sm">{{ item.status }}</span>
    </td>
    <td class="px-4 py-2 text-right">
      <button @click="$emit('view', item)" class="text-blue-600 dark:text-blue-200 mr-2 rounded bg-blue-100 dark:bg-blue-900">Xem</button>
      <button v-if="item.status==='Chờ duyệt'" @click="$emit('approve', item)" class="text-green-600 dark:text-green-200 mr-2 rounded bg-green-100 dark:bg-green-900">Duyệt</button>
      <button v-if="item.status==='Chờ duyệt'" @click="$emit('reject', item)" class="text-red-600 dark:text-red-200 rounded bg-red-100 dark:bg-red-900">Từ chối</button>
    </td>
  </tr>
</template>

<script setup>
// Khai báo props để lấy danh sách đơn nghỉ phép
const props = defineProps({ item: { type: Object, required: true } })
function statusClass(s) {
  if (s === 'Đã duyệt') return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
  if (s === 'Đã từ chối') return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
  return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-300'
}
</script>

<style scoped></style>
