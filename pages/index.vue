<template>
  <div class="dashboard">
    <h1>HR Dashboard Overview</h1>

    <div class="stats-grid">
      <DashboardStatCard title="Total Employees" :value="employeeStore.totalEmployees" />
      <DashboardStatCard title="Total Departments" :value="employeeStore.totalDepartments" />
      <DashboardStatCard title="Active Employees" :value="employeeStore.activeEmployees" />
      <DashboardStatCard title="Average Salary" :value="formattedSalary" />
    </div>

    <div class="info-box">
      <h2>System Summary</h2>
      <p>Total employees loaded: {{ employeeStore.totalEmployees }}</p>
      <p>Departments: {{ employeeStore.totalDepartments }}</p>
      <p>Active employees: {{ employeeStore.activeEmployees }}</p>
      <p>Average salary: {{ formattedSalary }}</p>
    </div>

    <DashboardDepartmentChart :chart-data="departmentStats" />
  </div>
</template>

<script setup>
const employeeStore = useEmployeeStore()

onMounted(async () => {
  await employeeStore.fetchEmployees()
})

const formattedSalary = computed(() => {
  return employeeStore.averageSalary.toLocaleString('vi-VN') + ' VND'
})

const departmentStats = computed(() => {
  const result = {}
  employeeStore.employees.forEach(emp => {
    result[emp.department] = (result[emp.department] || 0) + 1
  })
  return result
})
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: #f8fafc;
  padding: 24px;
}

h1 {
  font-size: 32px;
  margin-bottom: 24px;
  color: #0f172a;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.info-box,
.chart-box {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
}

.info-box h2,
.chart-box h2 {
  margin-bottom: 16px;
  color: #0f172a;
}

.info-box p,
.chart-box li {
  margin-bottom: 8px;
  color: #334155;
}

@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>