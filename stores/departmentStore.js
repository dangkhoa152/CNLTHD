import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useActivityStore } from './activityStore'
import { useDashboardStore } from './dashboard'
import { loadOrFetchArray, saveLocalStorageJSON } from '~/utils/persistence'
import { generateNextPrefixedId } from '~/utils/dataHelpers'

export const useDepartmentStore = defineStore('department', () => {
  const departments = ref([])
  const searchQuery = ref('')
  const isLoading = ref(false)

  function saveToLocal() {
    saveLocalStorageJSON('hrm_departments', departments.value)
  }

  function syncEmployeeCounts(allEmployees) {
    // 1. Đặt tất cả số lượng của các phòng ban về 0
    departments.value.forEach(dep => {
      dep.totalEmployee = 0
    })

    // 2. Chạy vòng lặp qua toàn bộ nhân viên
    allEmployees.forEach(emp => {
      // BƯỚC A: Tìm mã phòng ban (Hỗ trợ cả JSON cũ và mảng History mới)
      let currentDeptId = null
      let currentDeptName = null

      if (emp.history && emp.history.length > 0) {
        // Đọc theo chuẩn mới với mảng history
        currentDeptId = emp.history[0].departmentId
        currentDeptName = emp.history[0].department
      } else {
        // Đọc theo chuẩn file employees.json gốc
        currentDeptId = emp.departmentId
        currentDeptName = emp.department
      }

      // BƯỚC B: Tìm đúng phòng ban trong danh sách
      // Ưu tiên 1: Tìm chính xác bằng ID (An toàn tuyệt đối)
      let targetDept = departments.value.find(d => d.id === currentDeptId)
      
      // Ưu tiên 2: Nếu file JSON cũ không có ID, ráng mò bằng Tên phòng ban
      if (!targetDept && currentDeptName) {
        targetDept = departments.value.find(d => d.name === currentDeptName)
      }

      // BƯỚC C: Nếu tìm thấy phòng ban -> Cộng 1
      if (targetDept) {
        targetDept.totalEmployee += 1
      }
    })

    // 3. Lưu kết quả mới nhất vào Local Storage
    saveToLocal()
  }

  async function fetchDepartments() {
    isLoading.value = true
    try {
      departments.value = await loadOrFetchArray(
        'hrm_departments',
        '/data/departments.json',
        [],
        false
      )
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error)
    } finally {
      isLoading.value = false
    }
  }

  // 2. Action: THÊM MỚI
  const addDepartment = async (newDep) => {
    const activityStore = useActivityStore()
    const dashboardStore = useDashboardStore()

    let generateId = generateNextPrefixedId(departments.value, 'DEP', 2)

    // Logic tạo ID tự động
    if (departments.value.length > 0) {
      const existingNumbers = departments.value.map(dep => {
        const match = dep.id.match(/\d+/)
        return match ? parseInt(match[0], 10) : 0
      })
      const maxNumber = Math.max(...existingNumbers)
      const nextNumber = maxNumber + 1
      generateId = 'DEP' + nextNumber.toString().padStart(2, '0')
    }

    const departmentToSave = {
      ...newDep, 
      id: generateId,
      position: Array.isArray(newDep.position) ? newDep.position : []
    }
    departments.value.unshift(departmentToSave)
    saveToLocal()

    // Ghi nhận lịch sử hoạt động
    activityStore.logActivity('add', 'Thêm phòng ban mới', newDep.name || 'Phòng ban mới')
    dashboardStore.addActivity({
      type: 'add',
      title: `Thêm phòng ban mới: ${newDep.name || generateId}`,
      user: 'Admin HR'
    })
  }

  // 3. Action: CẬP NHẬT (SỬA)
  const updateDepartment = async (updatedDep) => {
    const activityStore = useActivityStore()
    const dashboardStore = useDashboardStore()

    const index = departments.value.findIndex(d => d.id === updatedDep.id)

    if (index !== -1) {
      const positionsArray = Array.isArray(updatedDep.position)
        ? updatedDep.position
        : departments.value[index].position || []

      departments.value[index] = {
        ...departments.value[index],
        ...updatedDep,
        position: positionsArray
      }
      saveToLocal()

      activityStore.logActivity('edit', 'Cập nhật phòng ban', updatedDep.name)
      dashboardStore.addActivity({
        type: 'update',
        title: `Cập nhật phòng ban: ${updatedDep.name}`,
        user: 'Admin HR'
      })

      return departments.value[index]
    }

    return null
  }

  async function deleteDepartment(deptId) {
    const activityStore = useActivityStore()
    const dashboardStore = useDashboardStore()

    await activityStore.fetchActivities()

    const depToDelete = departments.value.find(d => d.id === deptId)
    const depName = depToDelete ? depToDelete.name : deptId

    departments.value = departments.value.filter(dep => dep.id !== deptId)
    saveToLocal()

    activityStore.logActivity(
      'delete',
      'Xóa phòng ban',
      depName
    )

    dashboardStore.addActivity({
      type: 'delete',
      title: `Xóa phòng ban: ${depName}`,
      user: 'Admin HR'
    })
  }

  function getPositionById(id) {
    const dpm = departments.value.find(item => item.id === id)
    // Trả về mảng position nếu có, ngược lại trả về mảng rỗng
    if (dpm && dpm.position) {
      return dpm.position
    }
    return []
  }
  // 5. Getters: LỌC TÌM KIẾM
  const filteredDepartments = computed(() => {
    if (!searchQuery.value) return departments.value

    const query = searchQuery.value.toLowerCase()

    return departments.value.filter(dep =>
      [
        dep.id,
        dep.name,
        dep.employeeID,
        dep.employeeName,
        dep.description
      ]
        .join(' ')
        .toLowerCase()
        .includes(query)
    )
  })

  return {
    departments,
    searchQuery,
    isLoading,
    fetchDepartments,
    filteredDepartments,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    getPositionById,
    syncEmployeeCounts,
  }
})