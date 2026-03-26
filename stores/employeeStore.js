import { defineStore } from 'pinia'
import getNowString from '~/utils/formatDate'

export const useEmployeeStore = defineStore('employees', () => {
  const employees = ref([])
  const isLoading = ref(false)
  const query = ref({})
  const usedepartment = useDepartmentStore()
  const departments = usedepartment.departments
  const selectedDepartment = ref('')

  const searchQuery = ref('')
  const sortBy = ref('name')
  const sortDesc = ref(false)

  function saveToLocal() {
    if (process.client) {
      localStorage.setItem('hrm_employees', JSON.stringify(employees.value))
    }
  }

  function getCurrentHistory(emp) {
    if (!emp?.history || !Array.isArray(emp.history) || emp.history.length === 0) {
      return null
    }

    return emp.history.find(h => h.endDate === null) || emp.history[0]
  }

  function normalizeEmployee(emp) {
    const currentHistory = getCurrentHistory(emp)

    return {
      ...emp,
      departmentId: emp.departmentId || currentHistory?.departmentId || '',
      department: emp.department || currentHistory?.department || '',
      position: emp.position || currentHistory?.position || '',
      joinDate: emp.joinDate || currentHistory?.startDate || ''
    }
  }

  async function fetchEmployees(forceReload = false) {
    isLoading.value = true
    try {
      const saved = process.client ? localStorage.getItem('hrm_employees') : null

      if (!forceReload && saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          employees.value = parsed.map(normalizeEmployee)
          return
        }
      }

      const data = await $fetch('/data/employees.json')
      employees.value = Array.isArray(data) ? data.map(normalizeEmployee) : []
      saveToLocal()
    } catch (error) {
      console.error('Lỗi tải dữ liệu:', error)
      employees.value = []
    } finally {
      isLoading.value = false
    }
  }

  const searchEmployees = computed(() => {
    return employees.value.filter(i => {
      const department = i.department || getCurrentHistory(i)?.department || ''
      const q = (query.value.query || searchQuery.value || '').toLowerCase()

      if (selectedDepartment.value && department !== selectedDepartment.value) return false
      if (query.value.status && i.status !== query.value.status) return false
      if (query.value.department && department !== query.value.department) return false

      if (q) {
        return [i.name, i.employeeCode, department, i.position || '']
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
    searchQuery.value = ''
  }

  function addEmployee(payload) {
    const nextId =
      employees.value.length > 0
        ? Math.max(...employees.value.map(a => a.id)) + 1
        : 1

    const history = payload.history || [
      {
        id: 1,
        departmentId: payload.departmentId || '',
        department: payload.department || '',
        position: payload.position || '',
        startDate: getNowString().split(' ')[0],
        endDate: null
      }
    ]

    const item = normalizeEmployee({
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
      history
    })

    employees.value.unshift(item)

    const deptToUpdate = departments.value.find(
      dept => dept.name === item.department || dept.id === item.departmentId
    )

    if (deptToUpdate) {
      deptToUpdate.totalEmployee = (deptToUpdate.totalEmployee || 0) + 1
      usedepartment.saveToLocal()
    }

    saveToLocal()
    return item
  }

  function updateEmployee(id, patch) {
    const index = employees.value.findIndex(emp => emp.id === id)
    if (index !== -1) {
      const updated = normalizeEmployee({
        ...employees.value[index],
        ...patch
      })

      employees.value[index] = updated
      saveToLocal()
      return updated
    }
    return null
  }

  function deleteEmployee(id) {
    const empToDelete = employees.value.find(emp => emp.id === id)
    if (!empToDelete) return

    const targetDeptName = empToDelete.department
    const targetDeptId = empToDelete.departmentId

    employees.value = employees.value.filter(emp => emp.id !== id)

    const deptToUpdate = departments.value.find(
      dept => dept.name === targetDeptName || dept.id === targetDeptId
    )

    if (deptToUpdate && (deptToUpdate.totalEmployee || 0) > 0) {
      deptToUpdate.totalEmployee -= 1
    }

    saveToLocal()
    usedepartment.saveToLocal()
  }

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