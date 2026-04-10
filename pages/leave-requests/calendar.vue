<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950">
    <div class="p-6">
      <div class="rounded-[1.75rem] border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p class="text-sm font-semibold uppercase tracking-[0.28em] text-blue-600">Lịch nghỉ phép</p>
            <h2 class="mt-2 text-3xl font-bold text-slate-900 dark:text-white">Lịch nghỉ phép được duyệt</h2>
            <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Xem tổng quan về ngày nghỉ đã được phê duyệt theo lịch.</p>
          </div>
          <button @click="goBack" class="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
            Quay lại
          </button>
        </div>
      </div>

      <div class="mt-6 rounded-[1.75rem] border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <LeaveCalendar :events="approvedLeaves" />
      </div>
    </div>
  </div>
</template>

<script setup>

definePageMeta({
  middleware: ['auth'] 
})

import { computed, onMounted } from 'vue'
import LeaveCalendar from '~/components/leaveRequests/LeaveCalendar.vue'
import { useLeaveRequestStore } from '~/stores/leaveRequestStore'
const router = useRouter()
const leaveStore = useLeaveRequestStore()
const approvedLeaves = computed(() => leaveStore.leaveRequests.filter(i => i.status === 'Đã duyệt'))

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