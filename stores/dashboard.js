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

  async function fetchAll() {
    loading.value = true

    try {
      const [employeesData, departmentsData, leaveData] = await Promise.all([
        $fetch('/data/employees.json'),
        $fetch('/data/departments.json'),
        $fetch('/data/leave-request.json')
      ])

      employees.value = employeesData
      departments.value = departmentsData
      leaveRequests.value = leaveData

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
      if (employee.status === 'Đang làm việc') {
        statusMap['Đang làm việc']++
      } else if (employee.status === 'Nghỉ phép' || employee.status === 'Tạm nghỉ') {
        statusMap['Tạm nghỉ']++
      } else if (employee.status === 'Đã nghỉ việc' || employee.status === 'Nghỉ việc') {
        statusMap['Nghỉ việc']++
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