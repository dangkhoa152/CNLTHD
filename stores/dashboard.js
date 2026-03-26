import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useDashboardStore = defineStore('dashboard', () => {
  const employees = ref([])
  const departments = ref([])
  const leaveRequests = ref([])
  const activities = ref([])
  const loading = ref(false)

  function getNowString() {
    const now = new Date()
    const yyyy = now.getFullYear()
    const mm = String(now.getMonth() + 1).padStart(2, '0')
    const dd = String(now.getDate()).padStart(2, '0')
    const hh = String(now.getHours()).padStart(2, '0')
    const mi = String(now.getMinutes()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd} ${hh}:${mi}`
  }

  function saveActivitiesToLocal() {
    if (process.client) {
      localStorage.setItem('hrm_activities', JSON.stringify(activities.value))
    }
  }

  function loadActivitiesFromLocal() {
    if (process.client) {
      const saved = localStorage.getItem('hrm_activities')
      if (saved) {
        activities.value = JSON.parse(saved)
      }
    }
  }

  function getCurrentHistory(emp) {
    if (!emp?.history || !Array.isArray(emp.history) || emp.history.length === 0) {
      return null
    }

    return emp.history.find(h => h.endDate === null) || emp.history[0]
  }

  function normalizeStatus(status) {
    if (status === 'Nghỉ phép') return 'Tạm nghỉ'
    if (status === 'Đã nghỉ việc') return 'Nghỉ việc'
    return status
  }

  function normalizeEmployee(emp) {
    const currentHistory = getCurrentHistory(emp)

    return {
      ...emp,
      departmentId: emp.departmentId || currentHistory?.departmentId || '',
      department: emp.department || currentHistory?.department || '',
      position: emp.position || currentHistory?.position || '',
      status: normalizeStatus(emp.status || '')
    }
  }

  async function fetchAll() {
    loading.value = true

    try {
      const [employeesData, departmentsData, leaveData] = await Promise.all([
        $fetch('/data/employees.json'),
        $fetch('/data/departments.json'),
        $fetch('/data/leave-request.json')
      ])

      employees.value = Array.isArray(employeesData)
        ? employeesData.map(normalizeEmployee)
        : []

      departments.value = Array.isArray(departmentsData) ? departmentsData : []
      leaveRequests.value = Array.isArray(leaveData) ? leaveData : []

      if (process.client) {
        const saved = localStorage.getItem('hrm_activities')

        if (saved) {
          activities.value = JSON.parse(saved)
        } else {
          const activitiesData = await $fetch('/data/activities.json')
          activities.value = activitiesData
          saveActivitiesToLocal()
        }
      }
    } catch (error) {
      console.error('Lỗi tải dashboard:', error)
      employees.value = []
      departments.value = []
      leaveRequests.value = []
    } finally {
      loading.value = false
    }
  }

  function addActivity({ type, title, user, target = '' }) {
    const newActivity = {
      id: Date.now(),
      type,
      title,
      user,
      target,
      time: getNowString()
    }

    activities.value.unshift(newActivity)

    if (activities.value.length > 20) {
      activities.value = activities.value.slice(0, 20)
    }

    saveActivitiesToLocal()
  }

  const totalEmployees = computed(() => employees.value.length)

  const totalDepartments = computed(() => departments.value.length)

  const pendingLeaveRequests = computed(() =>
    leaveRequests.value.filter(item => item.status === 'Chờ duyệt').length
  )

  const activeEmployees = computed(() =>
    employees.value.filter(item => item.status === 'Đang làm việc').length
  )

  const employeesByDepartment = computed(() => {
    return departments.value.map(department => {
      const count = employees.value.filter(employee => {
        if (employee.departmentId) {
          return employee.departmentId === department.id
        }

        return employee.department === department.name
      }).length

      return {
        label: department.name,
        value: count
      }
    })
  })

  const employeesByStatus = computed(() => {
    const statusMap = {
      'Đang làm việc': 0,
      'Tạm nghỉ': 0,
      'Nghỉ việc': 0
    }

    employees.value.forEach(employee => {
      const normalized = normalizeStatus(employee.status)

      if (statusMap[normalized] !== undefined) {
        statusMap[normalized]++
      }
    })

    return [
      { label: 'Đang làm việc', value: statusMap['Đang làm việc'] },
      { label: 'Tạm nghỉ', value: statusMap['Tạm nghỉ'] },
      { label: 'Nghỉ việc', value: statusMap['Nghỉ việc'] }
    ]
  })

  return {
    employees,
    departments,
    leaveRequests,
    activities,
    loading,
    fetchAll,
    addActivity,
    loadActivitiesFromLocal,
    totalEmployees,
    totalDepartments,
    pendingLeaveRequests,
    activeEmployees,
    employeesByDepartment,
    employeesByStatus
  }
})