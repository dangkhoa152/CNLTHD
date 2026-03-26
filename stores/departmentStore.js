import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useActivityStore } from './activityStore'
import { useDashboardStore } from './dashboard'

export const useDepartmentStore = defineStore('department', () => {
  const departments = ref([])
  const searchQuery = ref('')
  const isLoading = ref(false)

  function saveToLocal() {
    if (process.client) {
      localStorage.setItem('hrm_departments', JSON.stringify(departments.value))
    }
  }

  function normalizeDepartment(dep) {
    return {
      id: dep.id || '',
      name: dep.name || '',
      employeeID: dep.employeeID || '',
      employeeName: dep.employeeName || '',
      budget: dep.budget || 0,
      totalEmployee: dep.totalEmployee || 0,
      description: dep.description || '',
      position: Array.isArray(dep.position) ? dep.position : []
    }
  }

  async function fetchDepartments(forceReload = false) {
    isLoading.value = true
    try {
      const storedData = process.client
        ? localStorage.getItem('hrm_departments')
        : null

      if (!forceReload && storedData) {
        const parsed = JSON.parse(storedData)
        if (Array.isArray(parsed) && parsed.length > 0) {
          departments.value = parsed.map(normalizeDepartment)
          return
        }
      }

      const data = await $fetch('/data/departments.json')
      departments.value = Array.isArray(data) ? data.map(normalizeDepartment) : []
      saveToLocal()
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu phòng ban:', error)
      departments.value = []
    } finally {
      isLoading.value = false
    }
  }

  async function addDepartment(newDep) {
    const activityStore = useActivityStore()
    const dashboardStore = useDashboardStore()

    await activityStore.fetchActivities()

    let generateId = 'DEP01'

    if (departments.value.length > 0) {
      const existingNumbers = departments.value.map(dep => {
        const match = dep.id.match(/\d+/)
        return match ? parseInt(match[0], 10) : 0
      })

      const maxNumber = Math.max(...existingNumbers)
      const nextNumber = maxNumber + 1
      generateId = 'DEP' + nextNumber.toString().padStart(2, '0')
    }

    const departmentToSave = normalizeDepartment({
      ...newDep,
      id: generateId,
      employeeID: newDep.employeeID || '',
      employeeName: newDep.employeeName || 'Chưa bổ nhiệm',
      totalEmployee: newDep.totalEmployee || 0,
      position: newDep.position || []
    })

    departments.value.unshift(departmentToSave)
    saveToLocal()

    activityStore.logActivity(
      'add',
      'Thêm phòng ban mới',
      departmentToSave.name
    )

    dashboardStore.addActivity({
      type: 'add',
      title: `Thêm phòng ban mới: ${departmentToSave.name}`,
      user: 'Admin HR'
    })

    return departmentToSave
  }

  async function updateDepartment(updatedDep) {
    const activityStore = useActivityStore()
    const dashboardStore = useDashboardStore()

    await activityStore.fetchActivities()

    const index = departments.value.findIndex(d => d.id === updatedDep.id)

    if (index !== -1) {
      const normalized = normalizeDepartment(updatedDep)
      departments.value[index] = normalized
      saveToLocal()

      activityStore.logActivity(
        'edit',
        'Cập nhật phòng ban',
        normalized.name
      )

      dashboardStore.addActivity({
        type: 'update',
        title: `Cập nhật phòng ban: ${normalized.name}`,
        user: 'Admin HR'
      })

      return normalized
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
    saveToLocal
  }
})