<template>

  <div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-4">
    <div>
      <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Quản lý nhân viên</h1>
      <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Xem, lọc và quản lý toàn bộ nhân viên trong công ty.</p>
    </div>
    <div class="flex items-center gap-2">
      <button @click="openCreate" class="inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
        Thêm nhân viên
      </button>
    </div>
  </div>

  <EmployeeFilter 
    :departments="departmentStore.departments" 
    @filter-changed="onFilter" 
    v-model:department="employeeStore.selectedDepartment"
    @reset="handleResetFilters" />

  <div class="my-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
    <StatCard title="Tổng nhân viên" :value="filtered.length" :subtitle="subTitle" :color="'blue'"/> 
    <StatCard title="Đang làm việc" :value="countFilteredStatus('Đang làm việc')" :subtitle="''" :color="'green'"/>
    <StatCard title="Đã nghỉ việc" :value="countFilteredStatus('Đã nghỉ việc')" :subtitle="''" :color="'red'"/>
    <StatCard title="Nghỉ phép" :value="countFilteredStatus('Nghỉ phép')" :subtitle="''" :color="'yellow'"/>
  </div>

  <EmployeeTable 
    :items="paginatedList" 
    :sortColumn="employeeStore.sortColumn"
    :sortOrder="employeeStore.sortOrder"
    @view="open" 
    @edit="openEdit"
    @delete="handleDeleteClick"
    @sort="employeeStore.setSort" 
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
<script setup>
import { ref, onMounted, computed } from 'vue'
import { toast } from 'vue3-toastify'
import EmployeeFilter from '~/components/employees/EmployeeFilter.vue'
import EmployeeTable from '~/components/employees/EmployeeTable.vue'
import Pagination from '~/components/common/Pagination.vue'
import EmployeeForm from '~/components/employees/EmployeeForm.vue'
import ConfirmModal from '~/components/common/ConfirmModal.vue'
import { useEmployeeStore } from '~/stores/employeeStore'
import StatCard from '~/components/dashboard/StatCard.vue'
const router = useRouter()
const route = useRoute()
const dashboard = useDashboardStore()
const auth = useAuthStore()
const activityStore = useActivityStore()
const employeeStore = useEmployeeStore()
const departmentStore = useDepartmentStore()
// sử dụng filter từ store: chỉ cần thay đổi filter ở component là store tự lọc
const selected = ref(null)
const formVisible = ref(false)
const isEdit = ref(false)
const formItem = ref(null)
const isConfirmOpen = ref(false)
const subTitle = ref('')

// Tải dữ liệu nhân viên khi component được mounted
onMounted(async () => {
  try {
    await employeeStore.fetchEmployees()
    await departmentStore.fetchDepartments()
    if (route.query.department) {
      // Nạp giá trị từ URL vào Store
      employeeStore.selectedDepartment = route.query.department
    } else {
      employeeStore.selectedDepartment = ''
    }
  } catch (e) {
    console.error('Không thể load dữ liệu', e)
  }
})

// Lay danh sach phong ban
// filtered list lấy trực tiếp từ store (unwrap value để reactive đúng)
const filtered = computed(() => employeeStore.sortedEmployees)

// Khai báo pagination dựa trên filtered
const {
  currentPage,
  totalPages,
  paginatedList,
  nextPage,
  prevPage,
  goToPage,
  visiblePages
} = usePagination(filtered, 10)

// Cập nhật filter trong store khi filter component thay đổi
function onFilter(payload) {
  employeeStore.setFilter(payload)
  subTitle.value = payload.department ? `của ${payload.department}` : 'của tất cả phòng ban'
}

// Hàm đếm số lượng đơn theo trạng thái
function countFilteredStatus(s) {
  return filtered.value.filter(i => i.status === s).length
}
//
function handleResetFilters() {
  employeeStore.clearFilter()
  employeeStore.selectedDepartment = ''
  router.replace({ query: {} })
  employeeStore.sortColumn = ''
  employeeStore.sortOrder =''
}
// sự kiện mở modal xem chi tiết
function open(item) {
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
function openEdit(item) {
  formItem.value = item
  formVisible.value = true
  isEdit.value = true
}

// Hàm sửa thông tin nhân viên
function update(payload) {
  if (formVisible.value) {
    if (!payload || !payload.id) return
    employeeStore.updateEmployee(payload.id, payload.patch || {})
    selected.value = null;
    closeForm()
    logUpdate(payload)
  }
}

// Ghi log hoạt động khi cập nhật hồ sơ nhân viên
function logUpdate(payload) {
  const targetName = formItem.value?.name || payload.name || 'Hồ sơ nhân viên'
  const userName = auth.user?.name || 'Admin HR'

  setTimeout(() => {
    dashboard.addActivity({ 
      type: 'update', 
      title: `Cập nhật thông tin của ${targetName}`, 
      user: userName 
    })
    
    activityStore.logActivity('edit', 'Cập nhật hồ sơ nhân viên', targetName, userName)
    
    toast.info(`Cập nhật thành công`)
  }, 50)
}

function create(payload) {
  if (formVisible.value) {
    if (!payload) return
    employeeStore.addEmployee(payload)
    closeForm()
    logCreate(payload)
  }   
}
// Đóng form tạo/sửa thông tin nhân viên
function closeForm() {
  formVisible.value = false
  formItem.value = null
}
// Ghi log hoạt động khi tạo nhân viên
function logCreate(payload) {
  setTimeout(() => {
    const userName = auth.user?.name || 'Admin HR'
    dashboard.addActivity({ type: 'add', title: `Tạo nhân viên mới : ${payload.name}`, user: userName })
    activityStore.logActivity('add', 'Tạo hồ sơ nhân viên', payload.name)
    toast.success('Tạo thành công!')
  }, 50)
}

function handleDeleteClick(item) {
  isConfirmOpen.value = true
  formItem.value = item;
}

function logDelete() {
  setTimeout(() => {
    const targetName = formItem.value?.name || "Một nhân viên"
    const userName = (auth.user)?.name || 'Admin HR'

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