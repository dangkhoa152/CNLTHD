<template>

  <div class="flex items-center justify-between mb-4">
    <h1 class="text-2xl font-bold mb-4">Quản lý đơn xin nghỉ phép</h1>
    <button @click="openCreate" class="bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded">Thêm đơn</button>
  </div>

  <LeaveRequestFilter :departments="departments" @filter-changed="onFilter" />

  <div class="my-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
    <div class="bg-white dark:bg-gray-800 p-4 rounded shadow-sm">
      <div class="text-sm text-gray-500 dark:text-gray-300 font-bold">Tổng đơn</div>
      <div class="text-2xl text-blue-500 dark:text-blue-300 font-bold">{{ filtered.length }}</div>
    </div>
    <div class="bg-white dark:bg-gray-800 p-4 rounded shadow-sm">
      <div class="text-sm text-gray-500 dark:text-gray-300 font-bold">Chờ duyệt</div>
      <div class="text-2xl text-yellow-500 dark:text-yellow-300 font-bold">{{ countFilteredStatus("Chờ duyệt") }}</div>
    </div>
    <div class="bg-white dark:bg-gray-800 p-4 rounded shadow-sm">
      <div class="text-sm text-gray-500 dark:text-gray-300 font-bold">Đã duyệt</div>
      <div class="text-2xl text-green-500 dark:text-green-300 font-bold">{{ countFilteredStatus("Đã duyệt") }}</div>
    </div>
    <div class="bg-white dark:bg-gray-800 p-4 rounded shadow-sm">
      <div class="text-sm text-gray-500 dark:text-gray-300 font-bold">Đã từ chối</div>
      <div class="text-2xl text-red-500 dark:text-red-300 font-bold">{{ countFilteredStatus("Đã từ chối") }}</div>
    </div>
  </div>

  <LeaveRequestTable :items="paginatedList" @view="open" @edit="openEdit" @delete="confirmDelete" />

  <div class="flex justify-center items-center gap-4 mt-4">
    <button @click="prevPage" :disabled="currentPage === 1">Trước</button>
    <span>{{ currentPage }} / {{ totalPages || 1 }}</span>
    <button @click="nextPage" :disabled="currentPage === totalPages || totalPages === 0">Sau</button>
  </div>

  <LeaveRequestModal v-if="selected" :item="selected" @close="selected = null" @approve="approve" @reject="reject" />

  <LeaveRequestFormModal v-if="formVisible" :item="formItem" @view="open" @close="closeForm" @create="create" @update="update"/>

</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import {toast} from 'vue3-toastify'
import LeaveRequestFilter from '~/components/leaveRequests/LeaveRequestFilter.vue'
import LeaveRequestTable from '~/components/leaveRequests/LeaveRequestTable.vue'
import LeaveRequestModal from '~/components/leaveRequests/LeaveRequestModal.vue'
import LeaveRequestFormModal from '~/components/leaveRequests/LeaveRequestFormModal.vue'
import { useLeaveRequestStore } from '~/stores/leaveRequestStore'
const dashboard = useDashboardStore()
const auth = useAuthStore()
// store-based state
const leaveStore = useLeaveRequestStore()
// sử dụng filter từ store: chỉ cần thay đổi filter ở component là store tự lọc
const selected = ref(null as any | null)
const formVisible = ref(false)
const formItem = ref(null as any | null)

const departments = computed(() => {
  return Array.from(new Set(leaveStore.leaveRequests.map((i: any) => i.department))).sort()
})

// filtered list lấy trực tiếp từ store (unwrap value để reactive đúng)
const filtered = computed(() => leaveStore.searchLeaveRequest)
// Khai báo pagination dựa trên filtered
const {
  currentPage,
  totalPages,
  paginatedList,
  nextPage,
  prevPage
} = usePagination(filtered, 12)

onMounted(async () => {
  try {
    await leaveStore.fetchLeaveRequests()
  } catch (e) {
    console.error('Không thể load dữ liệu đơn nghỉ phép', e)
  }
})
// Cập nhật filter trong store khi filter component thay đổi
function onFilter(payload: any) {
  leaveStore.setFilter(payload)
}
// Hàm đếm số lượng đơn theo trạng thái
function countFilteredStatus(s: string) {
  return filtered.value.filter((i: any) => i.status === s).length
}
// sự kiện mở modal xem chi tiết
function open(item: any) {
  selected.value = item
}
// Mở form tạo mới đơn nghỉ phép
function openCreate() {
  formItem.value = null
  formVisible.value = true
}
// Mở form chỉnh sửa đơn nghỉ phép
function openEdit(item: any) {
  formItem.value = item
  formVisible.value = true
}
// Duyệt đơn
function approve(item: any) {
  leaveStore.approveLeaveRequest(item.id)
  selected.value = null
}
// Từ chối đơn
function reject(item: any) {
  leaveStore.rejectLeaveRequest(item.id)
  selected.value = null
}
// Xác nhận trước khi xóa đơn nghỉ phép
function confirmDelete(item: any) {
  const isConfirmed = window.confirm('Bạn có chắc chắn muốn xóa đơn xin nghỉ phép này không? Hành động này không thể hoàn tác.')
  if (isConfirmed) {
    deleteRequest(item)
  }
}
// Xóa đơn nghỉ phép
function deleteRequest(item: any) {
  if (!item || !item.id) return
  leaveStore.deleteLeaveRequest(item.id)
  handleDelete()
}
// Gửi yêu cầu Cập nhật đơn nghỉ phép sau khi chỉnh sửa từ form modal
function update(payload: any) {
  if (!payload || !payload.id) return
  leaveStore.updateLeaveRequest(payload.id, payload.patch || {})
  selected.value = null
  handleUpdate()
}
// Gửi yêu cầu tạo đơn nghỉ phép mới từ form modal
function create(payload: any) {
  if (!payload) return
  leaveStore.addLeaveRequest(payload)
  formVisible.value = false
}
// Đóng form tạo/sửa đơn nghỉ phép
function closeForm() {
  formVisible.value = false
  formItem.value = null
}
// Ghi log hoạt động khi cập nhật đơn nghỉ phép
function handleUpdate() {
  setTimeout(() => {
    dashboard.addActivity({
      type: 'update',
      title: `Sửa đơn nghỉ phép của ${formItem.value?.employeeName || 'một nhân viên'}`,
      user: auth.user?.name || 'Admin HR'
    })

    toast.info(`Cập nhật thành công`)
  }, 50)
}
// Ghi log hoạt động khi xóa đơn nghỉ phép
function handleDelete() {
  setTimeout(() => {
    dashboard.addActivity({
      type: 'delete',
      title: `Đã xóa đơn nghỉ phép của ${formItem.value?.employeeName || 'một nhân viên'}`,
      user: auth.user?.name || 'Admin HR'
    })

    toast.info(`Xóa thành công`)
  }, 50)
}
</script>

<style></style>