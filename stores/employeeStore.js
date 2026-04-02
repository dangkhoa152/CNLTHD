import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import getNowString from '~/utils/formatDate'
import { useDepartmentStore } from './departmentStore'
import { loadOrFetchArray, saveLocalStorageJSON } from '~/utils/persistence'
import { toggleSortColumn } from '~/utils/dataHelpers'

export const useEmployeeStore = defineStore('employees', () => {
  const employees = ref([])
  const isLoading = ref(false)
  const query = ref({})
  const selectedDepartment = ref('')
  const sortColumn = ref('')
  const sortOrder = ref('asc')

  // Lưu data vào LocalStorage
  function saveToLocal() {
    if (process.client) {
      saveLocalStorageJSON('hrm_employees', employees.value)
      const deptStore = useDepartmentStore()
      deptStore.syncEmployeeCounts(employees.value)
    }
  }
  // fetch data
  async function fetchEmployees(forceRefresh = false) {
    isLoading.value = true
    try {
      employees.value = await loadOrFetchArray(
        'hrm_employees',
        '/data/employees.json',
        [],
        forceRefresh
      )
      if (process.client) {
        const deptStore = useDepartmentStore()
        deptStore.syncEmployeeCounts(employees.value)
      }
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
      employees.value = await loadOrFetchArray(
        'hrm_employees',
        '/data/employees.json',
        [],
        true
      )
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
        return [i.name, i.employeeCode, i.history[0].department, i.history[0].position || '']
          .join(' ')
          .toLowerCase()
          .includes(q)
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
    selectedDepartment.value = ''
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

    if (empToDelete.status === 'Đã nghỉ việc' && Array.isArray(empToDelete.history) && empToDelete.history.length > 0) {
      const activeHistory = empToDelete.history.find(record => record.endDate === null) || empToDelete.history[0]
      if (activeHistory && !activeHistory.endDate) {
        activeHistory.endDate = getNowString('')
      }
    }

    employees.value = employees.value.filter(emp => emp.id !== id)

    saveToLocal()
  }

  function setSort(column) {
    sortOrder.value = toggleSortColumn(sortColumn.value, sortOrder.value, column)
    sortColumn.value = column
  }

  const sortedEmployees = computed(() => {
    // Bước 1: Lấy kết quả ĐÃ LỌC từ searchEmployees
    const result = [...searchEmployees.value];

    // Bước 2: Nếu không có yêu cầu sắp xếp, trả về kết quả lọc luôn
    if (!sortColumn.value) return result;

    // Bước 3: Tiến hành sắp xếp trên mảng đã copy
    result.sort((a, b) => {
      const getValue = (emp, col) => {
        if (col === 'department' || col === 'position') {
          return emp.history?.[0]?.[col] || '';
        }
        return emp[col] || '';
      };

      let valueA = getValue(a, sortColumn.value);
      let valueB = getValue(b, sortColumn.value);

      // Xử lý so sánh chuỗi không phân biệt hoa thường
      if (typeof valueA === 'string') valueA = valueA.toLowerCase();
      if (typeof valueB === 'string') valueB = valueB.toLowerCase();

      if (valueA < valueB) return sortOrder.value === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortOrder.value === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  });

  // get employee by id
  function getEmployeeById(id) {
    const numericId = Number(id)
    return employees.value.find(emp => emp.id === numericId) || null
  }

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
    getEmployeeById
  }
})