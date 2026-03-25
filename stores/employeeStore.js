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
      if (selectedDepartment.value && i.department !== selectedDepartment.value) return false

      const q = (query.value.query || '').toLowerCase()

      if (query.value.status && i.status !== query.value.status) return false
      if (query.value.department && i.department !== query.value.department) return false

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

    const item = {
      id: nextId,
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
      avatar: payload.avatar || '/images/avatar.png',
      history: payload.history || [],
      ...payload
    }

    employees.value.unshift(item)

    const deptToUpdate = departments.value.find(dept => dept.name === payload.department)
    if (deptToUpdate) {
      deptToUpdate.totalEmployees += 1
      usedepartment.saveToLocal()
    }

    saveToLocal()
    return item
  }

  function updateEmployee(id, patch) {
    const index = employees.value.findIndex(emp => emp.id === id)
    if (index !== -1) {
      Object.assign(employees.value[index], patch)
      saveToLocal()
      return employees.value[index]
    }
    return null
  }

  function deleteEmployee(id) {
    const empToDelete = employees.value.find(emp => emp.id === id)
    if (!empToDelete) return

    const targetDeptName = empToDelete.department
    employees.value = employees.value.filter(emp => emp.id !== id)

    const deptToUpdate = departments.value.find(dept => dept.name === targetDeptName)
    if (deptToUpdate && deptToUpdate.totalEmployees > 0) {
      deptToUpdate.totalEmployees -= 1
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
    resetEmployeesFromSeed,
    searchEmployees,
    setFilter,
    clearFilter,
    updateEmployee,
    addEmployee,
    deleteEmployee
  }
})