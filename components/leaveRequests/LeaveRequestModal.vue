<template>
  <div v-if="item" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black opacity-40" @click="$emit('close')"></div>
    <div class="bg-white dark:bg-gray-800 rounded shadow-lg w-11/12 md:w-2/3 p-6 z-10">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Chi tiết đơn</h3>
        <button @click="$emit('close')" class="text-gray-600 dark:text-gray-300">X</button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><strong>Người xin:</strong> {{ item.employeeName }} ({{ item.employeeCode }})</div>
        <div><strong>Phòng ban:</strong> {{ item.department }}</div>
        <div><strong>Khoảng:</strong> {{ item.fromDate }} → {{ item.toDate }}</div>
        <div><strong>Số ngày:</strong> {{ item.days }}</div>
        <div class="md:col-span-2"><strong>Lý do:</strong> {{ item.reason }}</div>
        <div><strong>Trạng thái:</strong> <span :class="statusClass(item.status)">{{ item.status }}</span></div>
        <div><strong>Ngày tạo:</strong> {{ item.createdAt }}</div>
      </div>

      <div class="mt-6 text-right">
        <button v-if="item.status==='Chờ duyệt'" @click="$emit('approve', item)" class="bg-green-600 dark:bg-green-700 text-white px-4 py-2 rounded mr-2">Duyệt</button>
        <button v-if="item.status==='Chờ duyệt'" @click="$emit('reject', item)" class="bg-red-600 dark:bg-red-700 text-white px-4 py-2 rounded mr-2">Từ chối</button>
        <button @click="$emit('close')" class="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2 rounded">Đóng</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ item: { type: Object, default: null } })
function statusClass(s){
  if(!s) return ''
  if(s==='Đã duyệt') return 'text-green-700 dark:text-green-300'
  if(s==='Đã từ chối') return 'text-red-700 dark:text-red-300'
  return 'text-yellow-700 dark:text-yellow-300'
}
</script>

<style scoped></style>
