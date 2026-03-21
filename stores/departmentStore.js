import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useActivityStore } from './activityStore'

export const useDepartmentStore = defineStore('department', () => {
  const departments = ref([])
  const searchQuery = ref('')
  const isLoading = ref(true)

  // Hàm nội bộ: Lưu dữ liệu hiện tại vào LocalStorage của trình duyệt
  const saveToStorage = () => {
    localStorage.setItem('hr_departments', JSON.stringify(departments.value))
  }

  // 1. Action: LẤY DỮ LIỆU
  const fetchDepartments = async () => {
    if (departments.value.length > 0) {
      isLoading.value = false
      return
    }

    isLoading.value = true
    try {
      const storedData = localStorage.getItem('hr_departments')
      
      if (storedData) {
        departments.value = JSON.parse(storedData)
      } else {
        const data = await $fetch('/data/departments.json')
        if (data) {
          departments.value = data
          saveToStorage() 
        }
      }
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu phòng ban:', error)
    } finally {
      isLoading.value = false
    }
  }

  // 2. Action: THÊM MỚI
const addDepartment = async(newDep) => {
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

    const departmentToSave = {
      ...newDep,
      id: generateId,
      employeeCount: 0,
      manager: 'Chưa bổ nhiệm'
    }

    departments.value.unshift(departmentToSave)
    saveToStorage()

    activityStore.logActivity(
      'add', 
      'Thêm phòng ban mới', 
      newDep.name
    )
    dashboardStore.addActivity({ 
      type: 'add', 
      title: `Thêm phòng ban mới: ${newDep.name}`, 
      user: 'Admin HR' 
    })
}
  
  // 3. Action: CẬP NHẬT (SỬA)
  const updateDepartment = async(updatedDep) => {
    const activityStore = useActivityStore()
    const dashboardStore = useDashboardStore()

    await activityStore.fetchActivities()
    const index = departments.value.findIndex(d => d.id === updatedDep.id)
    if (index !== -1) {
      departments.value[index] = updatedDep
      saveToStorage() // Cập nhật lại LocalStorage

      activityStore.logActivity(
        'edit', 
        'Cập nhật phòng ban', 
        updatedDep.name 
      )

      dashboardStore.addActivity({ 
        type: 'update', 
        title: `Cập nhật phòng ban: ${updatedDep.name}`, 
        user: 'Admin HR' 
      })
    }
  }

  // 4. Action: XÓA
  const deleteDepartment = async(deptId) => {
    const activityStore = useActivityStore()
    const dashboardStore = useDashboardStore()

    await activityStore.fetchActivities()

    const depToDelete = departments.value.find(d => d.id === deptId)
    const depName = depToDelete ? depToDelete.name : deptId

    departments.value = departments.value.filter(dep => dep.id !== deptId)
    saveToStorage() // Cập nhật lại LocalStorage

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

  // 5. Getters: LỌC TÌM KIẾM
  const filteredDepartments = computed(() => {
    if (!searchQuery.value) return departments.value
    const query = searchQuery.value.toLowerCase()
    return departments.value.filter(dep => 
      dep.name.toLowerCase().includes(query) || 
      (dep.manager && dep.manager.toLowerCase().includes(query)) ||
      dep.id.toLowerCase().includes(query)
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
    deleteDepartment
  }
})