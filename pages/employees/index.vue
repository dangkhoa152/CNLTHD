<template>

  <div class="flex items-center justify-between mb-4">
    <h1 class="text-2xl font-bold mb-4">Quản lý nhân viên</h1>
    <div class="flex items-center gap-2">
      <button @click="openCreate" class="bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded">Thêm nhân
        viên</button>
    </div>
  </div>

  <EmployeeFilter 
    :departments="departmentStore.departments" 
    @filter-changed="onFilter" 
    v-model:department="employeeStore.selectedDepartment"
    @reset="handleResetFilters" />

  <div class="my-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
    <div class="bg-white dark:bg-gray-800 p-4 rounded shadow-sm">
      <div class="text-sm text-gray-500 dark:text-gray-300 font-bold">Tổng nhân viên</div>
      <div class="text-2xl text-blue-500 dark:text-blue-300 font-bold">{{ filtered.length }}</div>
    </div>
    <div class="bg-white dark:bg-gray-800 p-4 rounded shadow-sm">
      <div class="text-sm text-gray-500 dark:text-gray-300 font-bold">Đang làm việc</div>
      <div class="text-2xl text-green-500 dark:text-green-300 font-bold">{{ countFilteredStatus("Đang làm việc") }}
      </div>
    </div>
    <div class="bg-white dark:bg-gray-800 p-4 rounded shadow-sm">
      <div class="text-sm text-gray-500 dark:text-gray-300 font-bold">Nghỉ phép</div>
      <div class="text-2xl text-yellow-500 dark:text-yellow-300 font-bold">{{ countFilteredStatus("Nghỉ phép") }}</div>
    </div>
    <div class="bg-white dark:bg-gray-800 p-4 rounded shadow-sm">
      <div class="text-sm text-gray-500 dark:text-gray-300 font-bold">Nghỉ việc</div>
      <div class="text-2xl text-red-500 dark:text-red-300 font-bold">{{ countFilteredStatus("Đã nghỉ việc") }}</div>
    </div>
  </div>

  <EmployeeTable 
    :items="paginatedList" 
    @view="open" 
    @edit="openEdit"
    @delete="handleDeleteClick"
    @sort="handleSort" 
    />

  <Pagination :current-page="currentPage" :total-pages="totalPages" :visible-pages="visiblePages" @prev="prevPage"
    @next="nextPage" @go-to="goToPage" />

  <EmployeeForm v-if="formVisible" :isEdit="isEdit" :item="formItem" :departments="departmentStore.departments" @close="closeForm"
    @create="create" @update="update" />

  <div class="p-6">
    <ConfirmModal :isOpen="isConfirmOpen" title="Xóa nhân viên"
      message="Bạn có chắc chắn muốn xóa nhân viên này? Dữ liệu sẽ không thể khôi phục." confirmText="Xác nhận"
      type="danger" @cancel="isConfirmOpen = false" @confirm="executeDelete" />
  </div>

</template>
<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { toast } from 'vue3-toastify'
import EmployeeFilter from '~/components/employees/EmployeeFilter.vue'
import EmployeeTable from '~/components/employees/EmployeeTable.vue'
import Pagination from '~/components/common/Pagination.vue'
import EmployeeForm from '~/components/employees/EmployeeForm.vue'
import ConfirmModal from '~/components/common/ConfirmModal.vue'
import { useEmployeeStore } from '~/stores/employeeStore'
const router = useRouter()
const route = useRoute()
const dashboard = useDashboardStore()
const auth = useAuthStore()
const activityStore = useActivityStore()
const employeeStore = useEmployeeStore()
const departmentStore = useDepartmentStore()
// sử dụng filter từ store: chỉ cần thay đổi filter ở component là store tự lọc
const selected = ref(null as any | null)
const formVisible = ref(false)
const isEdit = ref(false)
const formItem = ref(null as any | null)
const isConfirmOpen = ref(false)

// Tải dữ liệu nhân viên khi component được mounted
onMounted(async () => {
  try {
    await employeeStore.fetchEmployees()
    await departmentStore.fetchDepartments()
    if (route.query.department) {
      // Nạp giá trị từ URL vào Store
      employeeStore.selectedDepartment = route.query.department as string
    } else {
      employeeStore.selectedDepartment = ''
    }
  } catch (e) {
    console.error('Không thể load dữ liệu', e)
  }
})

// Lay danh sach phong ban
// filtered list lấy trực tiếp từ store (unwrap value để reactive đúng)
const filtered = computed(() => employeeStore.searchEmployees)

// Khai báo pagination dựa trên filtered
const {
  currentPage,
  totalPages,
  paginatedList,
  nextPage,
  prevPage,
  goToPage,
  visiblePages
} = usePagination(filtered, 12)

// sorting
function handleSort(column: string) {
  employeeStore.setSort(column)
}

// Cập nhật filter trong store khi filter component thay đổi
function onFilter(payload: any) {
  employeeStore.setFilter(payload)
}

// Hàm đếm số lượng đơn theo trạng thái
function countFilteredStatus(s: string) {
  return filtered.value.filter((i: any) => i.status === s).length
}
//
function handleResetFilters() {
  // 1. Xóa dữ liệu lọc trong Store (Bảng sẽ tự động hiển thị lại toàn bộ)
  employeeStore.clearFilter()
  employeeStore.selectedDepartment = ''
  router.replace({ query: {} })
}
// sự kiện mở modal xem chi tiết
function open(item: any) {
  selected.value = item
  router.push(`/employees/[${item.id}]`)
}

// Mở form tạo mới nhân viên
function openCreate() {
  formItem.value = null
  formVisible.value = true
  isEdit.value = false
}
// Mở form chỉnh sửa nhân viên
function openEdit(item: any) {
  formItem.value = item
  formVisible.value = true
  isEdit.value = true
}

// Hàm sửa thông tin nhân viên
function update(payload: any) {
  if (formVisible.value) {
    if (!payload || !payload.id) return
    employeeStore.updateEmployee(payload.id, payload.patch || {})
    selected.value = null;
    logUpdate(payload)
    closeForm()
  }
}

// Ghi log hoạt động khi cập nhật hồ sơ nhân viên
function logUpdate(payload: any) {
  setTimeout(() => {
    const targetName = formItem.value?.name || payload.name
    const userName = (auth.user as any)?.name || 'Admin HR'
    dashboard.addActivity({ type: 'update', title: `Cập nhật thông tin của ${targetName}`, user: userName })
    activityStore.logActivity('edit', 'Cập nhật hồ sơ nhân viên', targetName)
    toast.info(`Cập nhật thành công`)
  }, 50)
}

function create(payload: any) {
  if (formVisible.value) {
    if (!payload) return
    employeeStore.addEmployee(payload)
    logCreate(payload)
    closeForm()
  }
}
// Đóng form tạo/sửa thông tin nhân viên
function closeForm() {
  formVisible.value = false
  formItem.value = null
}
// Ghi log hoạt động khi tạo nhân viên
function logCreate(payload: any) {
  setTimeout(() => {
    const userName = (auth.user as any)?.name || 'Admin HR'
    dashboard.addActivity({ type: 'add', title: `Tạo nhân viên mới : ${payload.name}`, user: userName })
    activityStore.logActivity('add', 'Tạo hồ sơ nhân viên', payload.name)
    toast.success('Tạo thành công!')
  }, 50)
}

function handleDeleteClick(item: any) {
  isConfirmOpen.value = true
  formItem.value = item;
}

// function deleteEmp(item: any){
//   if (!item || !item.id) return
//   employeeStore.deleteEmployee(item.id)
//   logDelete()
// }
// Ghi log hoạt động khi xóa nhân viên (chuyển trạng thái = nghỉ việc)
function logDelete() {
  setTimeout(() => {
    const targetName = formItem.value?.name || "Một nhân viên"
    const userName = (auth.user as any)?.name || 'Admin HR'

    dashboard.addActivity({ type: 'delete', title: `Hồ sơ nhân viên ${targetName} đã xóa`, user: userName })
    activityStore.logActivity('delete', 'Xóa hồ sơ nhân viên', targetName)

    toast.info(`Xóa thành công`)
  }, 50)
}

function executeDelete() {
  if (formItem.value.id) {
    employeeStore.deleteEmployee(formItem.value.id)
    isConfirmOpen.value = false
    logDelete()
  }
}
</script>

<style></style>