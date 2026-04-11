<template>

  <div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-4">
    <div>
      <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Quản lý đơn xin nghỉ phép</h1>
      <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Theo dõi, duyệt và quản lý toàn bộ đơn nghỉ phép của nhân sự.</p>
    </div>
    <div class="flex flex-wrap items-center gap-2">
      <button @click="toggleCalendar" class="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
        Xem lịch nghỉ
      </button>
      <button @click="openCreate" class="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
        Tạo đơn mới
      </button>
    </div>
  </div>

  <LeaveRequestFilter v-if="isAdmin" :departments="departments" @filter-changed="onFilter" @reset="handleResetFilters" />

  <div class="my-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
    <StatCard title="Tổng đơn" :value="filtered.length" :subtitle="''" :color="'blue'"/>
    <StatCard title="Chờ duyệt" :value="countFilteredStatus('Chờ duyệt')" :subtitle="''" :color="'yellow'"/>
    <StatCard title="Đã duyệt" :value="countFilteredStatus('Đã duyệt')" :subtitle="''" :color="'green'"/>
    <StatCard title="Từ chối" :value="countFilteredStatus('Từ chối')" :subtitle="''" :color="'red'"/>
  </div>

  <LeaveRequestTable 
    :items="paginatedList" 
    :sortColumn="leaveStore.sortColumn"
    :sortOrder="leaveStore.sortOrder"
    :reset-selection-counter="resetSelectionCounter"
    @view="open" 
    @edit="openEdit" 
    @delete="handleDeleteClick" 
    @bulk-approve="prepareBulkApprove" 
    @bulk-reject="prepareBulkReject" 
    @sort="leaveStore.setSort"
  />

  <Pagination 
      :current-page="currentPage"
      :total-pages="totalPages"
      :visible-pages="visiblePages"
      @prev="prevPage"
      @next="nextPage"
      @go-to="goToPage"
  />

  <LeaveRequestModal v-if="selected" :item="selected" @close="selected = null" @approve="approve" @reject="reject" />

  <LeaveRequestForm v-if="formVisible" :item="formItem" @view="open" @close="closeForm" @create="create" @update="update"/>

  <div class="p-6">
    <ConfirmModal 
      :isOpen="isConfirmOpen"
      title="Xóa đơn từ"
      :message="`Bạn có chắc chắn muốn xóa đơn từ của nhân viên ${formItem?.employeeName || 'nhân viên này'}? Dữ liệu sẽ không thể khôi phục.`"
      confirmText="Xác nhận"
      type="danger"
      @cancel="isConfirmOpen = false"
      @confirm="executeDelete"
    />

    <ConfirmModal
      :isOpen="bulkConfirmOpen"
      title="Xác nhận thao tác hàng loạt"
      :message="bulkAction === 'approve' ? `Bạn có chắc chắn muốn duyệt ${bulkActionIds.length} đơn nghỉ phép đã chọn?` : `Bạn có chắc chắn muốn từ chối ${bulkActionIds.length} đơn nghỉ phép đã chọn?`"
      confirmText="Xác nhận"
      cancelText="Hủy"
      type="warning"
      @cancel="cancelBulkAction"
      @confirm="confirmBulkAction"
    />
  </div>
</template>

<script setup>

definePageMeta({
  middleware: ['auth'] 
})

import { ref, onMounted, computed } from 'vue'
import {toast} from 'vue3-toastify'
import LeaveRequestFilter from '~/components/leaveRequests/LeaveRequestFilter.vue'
import LeaveRequestTable from '~/components/leaveRequests/LeaveRequestTable.vue'
import LeaveRequestModal from '~/components/leaveRequests/LeaveRequestModal.vue'
import LeaveRequestForm from '~/components/leaveRequests/LeaveRequestForm.vue'
import { useLeaveRequestStore } from '~/stores/leaveRequestStore'
import ConfirmModal from '~/components/common/ConfirmModal.vue'
import Pagination from '~/components/common/Pagination.vue'
import StatCard from '~/components/common/StatCard.vue'

const isAdmin = computed(() => auth.user?.role === 'admin')

const dashboard = useDashboardStore()
const auth = useAuthStore()
const activityStore = useActivityStore()
// store-based state
const leaveStore = useLeaveRequestStore()
// sử dụng filter từ store: chỉ cần thay đổi filter ở component là store tự lọc
const selected = ref(null)
const formVisible = ref(false)
const formItem = ref(null)
const isConfirmOpen = ref(false)
const bulkConfirmOpen = ref(false)
const bulkAction = ref('')
const bulkActionIds = ref([])
const resetSelectionCounter = ref(0)
const router = useRouter()

// Hàm chuyển sang trang lịch nghỉ phép
function toggleCalendar() { router.push('/leave-requests/calendar') }

const departments = computed(() => {
  return Array.from(new Set(leaveStore.leaveRequests.map(i => i.department))).sort()
})

// filtered list lấy trực tiếp từ store (unwrap value để reactive đúng)
const filtered = computed(() => leaveStore.sortedLeaveRequests)

// Khai báo pagination
const {
  currentPage,
  totalPages,
  paginatedList,
  nextPage,
  prevPage,
  goToPage,
  visiblePages
} = usePagination(filtered, 10)

onMounted(async () => {
  try {
    await leaveStore.fetchLeaveRequests()
  } catch (e) {
    console.error('Không thể load dữ liệu đơn nghỉ phép', e)
  }
})
// Cập nhật filter trong store khi filter component thay đổi
function onFilter(payload) {
  leaveStore.setFilter(payload)
}

function handleResetFilters() {
  leaveStore.clearFilter()
  leaveStore.sortColumn = ''
  leaveStore.sortOrder =''
}

// Hàm đếm số lượng đơn theo trạng thái
function countFilteredStatus(s) {
  return filtered.value.filter(i => i.status === s).length
}
// sự kiện mở modal xem chi tiết
function open(item) {
  selected.value = item
}
// Mở form tạo mới đơn nghỉ phép
function openCreate() {
  formItem.value = null
  formVisible.value = true
}
// Mở form chỉnh sửa đơn nghỉ phép
function openEdit(item) {
  if(item.status !== 'Chờ duyệt') {
    setTimeout(() => {
      toast.warning(`Không thể chỉnh sửa đơn ${item.status}`)
    }, 50)
    return
  }
  formItem.value = item
  formVisible.value = true
}
// Duyệt đơn
function approve(item) {
  leaveStore.approveLeaveRequest(item.id, auth.user?.name || 'Admin HR')
  const userName = auth.user?.name || 'Admin HR'
  setTimeout(() => {
    dashboard.addActivity({ type: 'approve', title: `Duyệt đơn nghỉ phép của ${item.employeeName}`, user: userName })
    activityStore.logActivity('edit', 'Duyệt đơn nghỉ phép', item.employeeName)
    toast.success('Đã duyệt đơn!')
  }, 50)
  selected.value = null

}
// Từ chối đơn
function reject(item) {
  leaveStore.rejectLeaveRequest(item.id, auth.user?.name || 'Admin HR', item.rejectionReason || '')
  const userName = auth.user?.name || 'Admin HR'
  setTimeout(() => {
    dashboard.addActivity({ type: 'reject', title: `Từ chối đơn nghỉ phép của ${item.employeeName}`, user: userName })
    activityStore.logActivity('edit', 'Từ chối đơn nghỉ phép', item.employeeName)
    toast.warning('Đã từ chối đơn!')
  }, 50)
  selected.value = null
}
// Xác nhận trước khi xóa đơn nghỉ phép
function handleDeleteClick(item) {
  isConfirmOpen.value = true;
  formItem.value = item;
}
// Xóa đơn nghỉ phép
function executeDelete() {
  if (!formItem.value || !formItem.value.id) return
  leaveStore.deleteLeaveRequest(formItem.value.id)
  isConfirmOpen.value = false;
  logDelete()
}
// Gửi yêu cầu Cập nhật đơn nghỉ phép sau khi chỉnh sửa từ form modal
function update(payload) {
  if (!payload || !payload.id) return
  leaveStore.updateLeaveRequest(payload.id, payload.patch || {})
  selected.value = null
  logUpdate()
  closeForm()
}
// Gửi yêu cầu tạo đơn nghỉ phép mới từ form modal
function create(payload) {
  if (!payload) return
  leaveStore.addLeaveRequest(payload)
  formVisible.value = false
  toast.success('Tạo đơn thành công!')
  closeForm()
  logCreate()
}

function logCreate(){
  setTimeout(() => {
    const targetName = formItem.value?.employeeName || 'một nhân viên'
    const userName = auth.user?.name || 'Admin HR'
    dashboard.addActivity({ type: 'add', title: `Tạo đơn nghỉ phép cho ${targetName}`, user: userName })
    activityStore.logActivity('add', 'Tạo đơn xin nghỉ', targetName)
  }, 50)
}
// Đóng form tạo/sửa đơn nghỉ phép
function closeForm() {
  formVisible.value = false
  formItem.value = null
}
// Ghi log hoạt động khi cập nhật đơn nghỉ phép
function logUpdate() {
  setTimeout(() => {
    const targetName = formItem.value?.employeeName || 'một nhân viên'
    const userName = auth.user?.name || 'Admin HR' 
    dashboard.addActivity({ type: 'update', title: `Sửa đơn nghỉ phép của ${targetName}`, user: userName })
    activityStore.logActivity('edit', 'Cập nhật đơn nghỉ phép', targetName)
    toast.info(`Cập nhật thành công`)
  }, 50)
}
// Ghi log hoạt động khi xóa đơn nghỉ phép
function logDelete() {
  setTimeout(() => {
    const targetName = formItem.value?.employeeName || 'một nhân viên'
    const userName = auth.user?.name || 'Admin HR'
    dashboard.addActivity({ type: 'delete', title: `Đã xóa đơn nghỉ phép của ${targetName}`, user: userName })
    activityStore.logActivity('delete', 'Xóa đơn nghỉ phép', targetName)
    toast.info(`Xóa thành công`)
  }, 50)
}
// ghi log hoạt động khi duyệt hoặc từ chối hàng loạt đơn nghỉ phép
function logBulkAction(action, count) {
  setTimeout(() => {
    const titleText = action === 'approve' ? 'Duyệt' : 'Từ chối'
    const userName = auth.user?.name || 'Admin HR'

    dashboard.addActivity({ type: action, title: `${titleText} ${count} đơn nghỉ phép`, user: userName })
    activityStore.logActivity('edit', `${titleText} hàng loạt`, `${count} đơn từ`)

    toast.info(`${titleText} thành công ${count} đơn`)
  }, 50)
}
// Xử lý duyệt hàng loạt
function prepareBulkApprove(ids) {
  if (!ids || ids.length === 0) return
  bulkAction.value = 'approve'
  bulkActionIds.value = ids
  bulkConfirmOpen.value = true
}

function prepareBulkReject(ids) {
  if (!ids || ids.length === 0) return
  bulkAction.value = 'reject'
  bulkActionIds.value = ids
  bulkConfirmOpen.value = true
}

function confirmBulkAction() {
  if (!bulkActionIds.value.length) return

  if (bulkAction.value === 'approve') {
    handleBulkApprove(bulkActionIds.value)
  } else if (bulkAction.value === 'reject') {
    handleBulkReject(bulkActionIds.value)
  }

  bulkConfirmOpen.value = false
  bulkActionIds.value = []
  bulkAction.value = ''
  resetSelectionCounter.value += 1
}

function cancelBulkAction() {
  bulkConfirmOpen.value = false
  bulkActionIds.value = []
  bulkAction.value = ''
}
// Xử lý duyệt hàng loạt
function handleBulkApprove(ids) {
  if (!ids || ids.length === 0) return
  leaveStore.bulkUpdateStatus(ids, 'Đã duyệt', auth.user?.name || 'Admin HR')
  logBulkAction('approve', ids.length)
}
// Xử lý từ chối hàng loạt
function handleBulkReject(ids) {
  if (!ids || ids.length === 0) return
  leaveStore.bulkUpdateStatus(ids, 'Đã từ chối', auth.user?.name || 'Admin HR')
  logBulkAction('reject', ids.length)
}
</script>

<style></style>