export const useDashboardStore = defineStore('dashboard', () => {
  const employees = ref([])
  const departments = ref([])
  const leaveRequests = ref([])
  const activities = ref([])
  const loading = ref(false)

  async function fetchAll() {
    loading.value = true

    try {
      const [employeesData, departmentsData, leaveData, activitiesData] = await Promise.all([
        $fetch('/data/employees.json'),
        $fetch('/data/departments.json'),
        $fetch('/data/leave-request.json'),
        $fetch('/data/activities.json')
      ])

      employees.value = employeesData
      departments.value = departmentsData
      leaveRequests.value = leaveData
      activities.value = activitiesData
    } finally {
      loading.value = false
    }
  }

  const totalEmployees = computed(() => employees.value.length)

  const totalDepartments = computed(() => departments.value.length)

  const pendingLeaveRequests = computed(() =>
    leaveRequests.value.filter(item => item.status === 'Chờ duyệt').length
  )

  const activeEmployees = computed(() =>
    employees.value.filter(item => item.status === 'Đang làm việc').length
  )

  // Biểu đồ tròn hiển thị tỷ lệ nhân viên theo phòng ban
  const employeesByDepartment = computed(() => {
    return departments.value.map(department => {
      const count = employees.value.filter(
        employee => employee.department === department.name
      ).length

      return {
        label: department.name,
        value: count
      }
    })
  })

  // Biểu đồ cột theo trạng thái nhân viên
  const employeesByStatus = computed(() => {
    const statusMap = {
      'Đang làm việc': 0,
      'Tạm nghỉ': 0,
      'Nghỉ việc': 0
    }

    employees.value.forEach(employee => {
      if (statusMap[employee.status] !== undefined) {
        statusMap[employee.status]++
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
    totalEmployees,
    totalDepartments,
    pendingLeaveRequests,
    activeEmployees,
    employeesByDepartment,
    employeesByStatus
  }
})