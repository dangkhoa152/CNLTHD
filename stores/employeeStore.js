import { defineStore } from 'pinia'
import getNowString from '~/utils/formatDate'

export const useEmployeeStore = defineStore('employees', () => {
  const employees = ref([])
  const isLoading = ref(false)
  const query = ref({})

  const usedepartment = useDepartmentStore()
  const departments = usedepartment.departments

  const selectedDepartment = ref('')

  const sortColumn = ref('')
  const sortOrder = ref('asc')
  // Lưu data vào LocalStorage
  function saveToLocal() {
    if (process.client) {
      localStorage.setItem('hrm_employees', JSON.stringify(employees.value))
    }
  }
  // fetch data
  async function fetchEmployees(forceRefresh = false) {
    isLoading.value = true
    try {
      const saved = process.client ? localStorage.getItem('hrm_employees') : null

      if (!forceRefresh && saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          employees.value = parsed
          return
        }
      }

      const data = await $fetch('/data/employees.json')
      employees.value = Array.isArray(data) ? data : []
      saveToLocal()
    } catch (error) {
      console.error('Lỗi tải dữ liệu:', error)
    } finally {
      isLoading.value = false
    }
  }
  // reset data
  async function resetEmployeesFromSeed() {
    isLoading.value = true
    try {
      const data = await $fetch('/data/employees.json')
      employees.value = Array.isArray(data) ? data : []
      saveToLocal()
    } catch (error) {
      console.error('Lỗi reset dữ liệu:', error)
    } finally {
      isLoading.value = false
    }
  }

  const searchEmployees = computed(() => {
    return employees.value.filter(i => {
      // Trích xuất phòng ban hiện tại từ mảng history
      const currentDept = i.history?.[0]?.department || ''
      // Lọc theo  Department (from Department UI)
      if (selectedDepartment.value && currentDept !== selectedDepartment.value) return false

      if (query.value.status && i.status !== query.value.status) return false
      if (query.value.department && currentDept !== query.value.department) return false
      // Lọc theo từ khóa tìm kiếm (Search box)
      const q = (query.value.query || '').toLowerCase()
      if (q) {
        return [i.name, i.employeeCode].join(' ').toLowerCase().includes(q)
      }
      return true
    })
  })

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
    const nextId =
      employees.value.length > 0
        ? Math.max(...employees.value.map(a => a.id)) + 1
        : 1

    // Đóng gói thông tin phòng ban/chức vụ vào mảng history
    const initialHistory = payload.history && payload.history.length > 0
      ? payload.history
      : [{
        id: 1,
        departmentId: payload.departmentId || '',
        department: payload.department || '',
        position: payload.position || '',
        startDate: getNowString(''),
        endDate: null
      }]

    const item = {
      id: nextId,
      employeeCode: payload.employeeCode || '',
      name: payload.name || '',
      gender: payload.gender || '',
      dateOfBirth: payload.dateOfBirth || '',
      email: payload.email || '',
      phone: payload.phone || '',
      address: payload.address || '',
      status: payload.status || 'Đang làm việc',
      avatar: payload.avatar || '/images/avatar.png',
      history: initialHistory,
      ...payload
    }

    employees.value.unshift(item)
    // Update quantity for department store
    const currentDeptName = item.history[0]?.department
    if (currentDeptName) {
      const deptToUpdate = departments.value.find(dept => dept.name === currentDeptName)
      if (deptToUpdate) {
        deptToUpdate.totalEmployees += 1
        usedepartment.saveToLocal()
      }
    }

    saveToLocal()
    return item
  }

  function updateEmployee(id, patch) {
    const index = employees.value.findIndex(emp => emp.id === id)
    if (index === -1) return null

    const emp = employees.value[index]

    const currentHistory = emp.history && emp.history.length > 0 ? emp.history[0] : null
    const currentDept = currentHistory ? currentHistory.department : ''
    const currentPos = currentHistory ? currentHistory.position : ''

    // Lấy thông tin chức vụ/phòng ban mới được truyền vào
    const newDept = patch.department !== undefined ? patch.department : currentDept
    const newPos = patch.position !== undefined ? patch.position : currentPos

    // 2. Kiểm tra xem có sự thay đổi về Vị trí hoặc Phòng ban không
    const isRoleChanged = (newDept !== currentDept) || (newPos !== currentPos)

    if (isRoleChanged) {
      const today = getNowString('')
      if (currentHistory) {
        currentHistory.endDate = today
      }

      // Tạo bản ghi lịch sử mới
      const newHistoryRecord = {
        id: currentHistory.id + 1,
        departmentId: patch.departmentId || currentHistory?.departmentId || '',
        department: newDept,
        position: newPos,
        startDate: today,
        endDate: null
      }

      // Thêm chức vụ mới lên vị trí đầu tiên của mảng history
      emp.history.unshift(newHistoryRecord)

      // BƯỚC C: Cập nhật số lượng nhân sự của các phòng ban (Nếu chuyển phòng)
      if (newDept !== currentDept) {
        // Giảm 1 người ở phòng cũ
        const oldDeptObj = departments.value.find(d => d.name === currentDept)
        if (oldDeptObj && oldDeptObj.totalEmployees > 0) {
          oldDeptObj.totalEmployees -= 1
        }
        // Tăng 1 người ở phòng mới
        const newDeptObj = departments.value.find(d => d.name === newDept)
        if (newDeptObj) {
          newDeptObj.totalEmployees += 1
        }
        usedepartment.saveToLocal() // Lưu lại store phòng ban
      }
    }
    // Cập nhật các thông tin cơ bản khác (Tên, SĐT, Email...)
    const { department, position, departmentId, history, ...basicInfoPatch } = patch
    Object.assign(employees.value[index], basicInfoPatch)
    saveToLocal()

    return employees.value[index]
  }

  function deleteEmployee(id) {
    const empToDelete = employees.value.find(emp => emp.id === id)
    if (!empToDelete) return

    // Móc tên phòng ban từ history ra để trừ số lượng
    const targetDeptName = empToDelete.history?.[0]?.department

    employees.value = employees.value.filter(emp => emp.id !== id)

    // Cập nhật số lượng sang Store Phòng ban
    if (targetDeptName) {
      const deptToUpdate = departments.value.find(dept => dept.name === targetDeptName)
      if (deptToUpdate && deptToUpdate.totalEmployees > 0) {
        deptToUpdate.totalEmployees -= 1
        usedepartment.saveToLocal()
      }
    }

    saveToLocal()
  }

  function setSort(column) {
    if (sortColumn.value === column) {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortColumn.value = column
      sortOrder.value = 'asc'
    }
  }

  const sortedEmployees = computed(() => {
    let result = searchEmployees.value;
    if (!sortColumn.value) return result;
    // Tiến hành sắp xếp
    result.sort((a, b) => {
      const getValue = (emp, col) => {
        if (col === 'department' || col === 'position') {
          return emp.history?.[0]?.[col] || ''
        }
        return emp[col] || ''
      }
      let valueA = getValue(a, sortColumn.value)
      let valueB = getValue(b, sortColumn.value)
      // Đưa về chữ thường hết để so sánh chuỗi (A và a phải bằng nhau)
      if (typeof valueA === 'string') valueA = valueA.toLowerCase();
      if (typeof valueB === 'string') valueB = valueB.toLowerCase();
      // Thuật toán so sánh
      if (valueA < valueB) return sortOrder.value === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortOrder.value === 'asc' ? 1 : -1;
      return 0; // Bằng nhau
    });
    return result;
  });

  // get employee history
  function getEmployeeHistory(id) {
    const numericId = Number(id)

    const emp = employees.value.map(e => e.id === numericId)
    if(emp && emp.history){
      return emp.history
    }

    return []
  } 
  // Trả ra các biến và hàm để Component sử dụng
  return {
    employees,
    isLoading,
    selectedDepartment,
    sortColumn,
    sortOrder,
    sortedEmployees,
    setSort,
    fetchEmployees,
    resetEmployeesFromSeed,
    searchEmployees,
    setFilter,
    clearFilter,
    updateEmployee,
    addEmployee,
    deleteEmployee,
    getEmployeeHistory
  }
})