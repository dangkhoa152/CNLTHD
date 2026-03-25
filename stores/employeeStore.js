import { defineStore } from 'pinia'
import getNowString from '~/utils/formatDate'
export const useEmployeeStore = defineStore('employees', () => {
  // 1. STATE (Trạng thái lưu trữ)
  const employees = ref([])
  const isLoading = ref(false)
  const query = ref({})
  const usedepartment = useDepartmentStore()
  const departments = usedepartment.departments
  const selectedDepartment = ref('')
  // Trạng thái cho Data Grid
  const searchQuery = ref('')
  const sortBy = ref('name') // Cột đang sắp xếp
  const sortDesc = ref(false) // Tăng dần hay giảm dần

  // Lưu data vào LocalStorage
  function saveToLocal() {
    if (process.client) {
      localStorage.setItem('hrm_employees', JSON.stringify(employees.value))
    }
  }

  // lấy data từ file JSON 
  async function fetchEmployees() {
    isLoading.value = true
    try {
      // Thử lấy từ LocalStorage trước
      const saved = process.client ? localStorage.getItem('hrm_employees') : null
      if (saved && JSON.parse(saved).length > 0) {
        // Nếu có dữ liệu cũ trong máy thì dùng luôn
        employees.value = JSON.parse(saved)
      } else {
        // Nếu máy trống trơn, mới đi tải file JSON
        const data = await $fetch('/data/employees.json')
        employees.value = data
        // Tải xong thì lưu vào Local cho lần sau
        saveToLocal()
      }
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error)
    } finally {
      isLoading.value = false
    }
  }

  // Tìm kiếm nhân viên theo tên hoặc mã
  const searchEmployees = computed(() => {
    return employees.value.filter(i => {
      if (selectedDepartment.value && i.department !== selectedDepartment.value) return false;
      const q = (query.value.query || '').toLowerCase()
      if (query.value.status && i.status !== query.value.status) return false
      if (query.value.department && i.department !== query.value.department) return false
      if (q) {
        return [i.name, i.employeeCode].join(' ').toLowerCase().includes(q)
      }
      return true
    })
  })

  // Cập nhật filter/query để lọc danh sách nhân viên
  function setFilter(payload) {
    if (payload === undefined || payload === null) {
      query.value = {}
      return
    }
    query.value = { ...query.value, ...payload }
  }

  function clearFilter() {
    query.value = {}
  }

  function addEmployee(payload) {
     const nextId = employees.value.length > 0
      ? Math.max(...employees.value.map(a => a.id)) + 1
      : 1
    const item = {
      nextId,
      employeeCode: payload.employeeCode || '',
      name: payload.name || '',
      gender: payload.gender || '',
      dateOfBirth: payload.dateOfBirth || '',
      email: payload.email || '',
      phone: payload.phone || '',
      address: payload.address || '',
      departmentId: payload.departmentId || '',
      department: payload.department || '',
      position: payload.position || '',
      status: payload.status || 'Đang làm việc',
      joinDate: getNowString(),
      avatar: payload.avatar,
      ...payload
    }
    // Thêm nhân viên mới lên đầu danh sách
    employees.value.unshift(item)
    // Tìm cái phòng ban đó trong mảng departments
    const deptToUpdate = departments.value.find(dept => dept.name === payload.department)
    // Nếu tìm thấy, trừ số lượng nhân viên đi 1
    if (deptToUpdate && deptToUpdate.totalEmployees > 0) {
      deptToUpdate.totalEmployees += 1
      usedepartment.saveToLocal()
    }
    saveToLocal()
    return item
  }

  // [UPDATE] - Sửa thông tin nhân viên
  function updateEmployee(id, patch) {
    const index = employees.value.findIndex(emp => emp.id === id)
    if (index !== -1) {
      // Ghi đè dữ liệu mới vào đúng vị trí của nhân viên đó
      Object.assign(employees.value[index], patch)
      saveToLocal()
      return employees.value[index]
    }
    return null
  }

  function deleteEmployee(id) {
    const empToDelete = employees.value.find(emp => emp.id === id)
    if (!empToDelete) return 
    // Lấy tên phòng ban của người sắp bị xóa
    const targetDeptName = empToDelete.department
    employees.value = employees.value.filter(emp => emp.id !== id)
    // Tìm cái phòng ban đó trong mảng departments
    const deptToUpdate = departments.value.find(dept => dept.name === targetDeptName)
    // Nếu tìm thấy, trừ số lượng nhân viên đi 1
    if (deptToUpdate && deptToUpdate.totalEmployees > 0) {
      deptToUpdate.totalEmployees -= 1
    }
    saveToLocal()
    usedepartment.saveToLocal()
  }
  // Trả ra các biến và hàm để Component sử dụng
  return {
    employees,
    isLoading,
    selectedDepartment,
    searchQuery,
    sortBy,
    sortDesc,
    fetchEmployees,
    searchEmployees,
    setFilter,
    clearFilter,
    updateEmployee,
    addEmployee,
    deleteEmployee
  }
})