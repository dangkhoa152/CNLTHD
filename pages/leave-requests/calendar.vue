<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="flex items-center justify-between p-4 border-b bg-white dark:bg-gray-800">
      <div class="flex items-center gap-3">
        <button @click="goBack" class="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded">Quay lại</button>
        <h2 class="text-xl font-bold">Lịch nghỉ phép</h2>
      </div>
    </div>

    <div class="p-6">
      <LeaveCalendar :events="approvedLeaves" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import LeaveCalendar from '~/components/leaveRequests/LeaveCalendar.vue'
import { useLeaveRequestStore } from '~/stores/leaveRequestStore'
const router = useRouter()
const leaveStore = useLeaveRequestStore()
const approvedLeaves = computed(() => leaveStore.leaveRequests.filter((i: any) => i.status === 'Đã duyệt'))

function goBack() {
  router.back()
}

onMounted(async () => {
  try {
    await leaveStore.fetchLeaveRequests()
  } catch (e) {
    console.error('Không thể load dữ liệu đơn nghỉ phép', e)
  }
})
</script>

<style scoped></style>
