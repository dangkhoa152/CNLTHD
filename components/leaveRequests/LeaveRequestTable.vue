<template>
  <div class="bg-white dark:bg-gray-800 rounded shadow-sm overflow-x-auto">
    <table class="min-w-full divide-y">
      <thead class="bg-gray-50 dark:bg-gray-700">
        <tr>
          <th class="text-left px-4 py-2 text-gray-700 dark:text-gray-200">Người xin</th>
          <th class="text-left px-4 py-2 text-gray-700 dark:text-gray-200">Mã</th>
          <th class="text-left px-4 py-2 text-gray-700 dark:text-gray-200">Phòng ban</th>
          <th class="text-left px-4 py-2 text-gray-700 dark:text-gray-200">Ngày</th>
          <th class="text-left px-4 py-2 text-gray-700 dark:text-gray-200">Số ngày</th>
          <th class="text-left px-4 py-2 text-gray-700 dark:text-gray-200">Lý do</th>
          <th class="text-left px-4 py-2 text-gray-700 dark:text-gray-200">Trạng thái</th>
          <th class="px-4 py-2 text-gray-700 dark:text-gray-200">Hành động</th>
        </tr>
      </thead>
      <tbody class="bg-white dark:bg-gray-800 divide-y dark:divide-gray-700">
        <LeaveRequestRow
          v-for="it in items"
          :key="it.id"
          :item="it"
          @view="$emit('view', $event)"
          @approve="$emit('approve', $event)"
          @reject="$emit('reject', $event)"
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
//Khởi tạo props để nhận dữ liệu từ component cha và định nghĩa các sự kiện để giao tiếp với component cha
//  khi người dùng thực hiện các hành động như xem, duyệt hoặc từ chối đơn nghỉ phép.
const props = defineProps({ items: { type: Array, default: () => [] } })
const emit = defineEmits(['view','approve','reject'])
</script>

<style scoped></style>
