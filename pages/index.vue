<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold">Tổng quan hệ thống</h1>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Theo dõi nhanh tình hình nhân sự của hệ thống
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Tổng nhân viên"
        :value="dashboard.totalEmployees"
        subtitle="Từ dữ liệu employees.json"
      />
      <StatCard
        title="Tổng phòng ban"
        :value="dashboard.totalDepartments"
        subtitle="Từ dữ liệu departments.json"
      />
      <StatCard
        title="Đơn chờ duyệt"
        :value="dashboard.pendingLeaveRequests"
        subtitle="Từ dữ liệu leave-request.json"
      />
      <StatCard
        title="Đang làm việc"
        :value="dashboard.activeEmployees"
        subtitle="Nhân viên có trạng thái hoạt động"
      />
    </div>

    <div class="grid grid-cols-1 gap-6 mb-6">
      <DepartmentPieChart
        :labels="departmentLabels"
        :values="departmentValues"
      />
    </div>

    <div class="grid grid-cols-1 gap-6">
      <EmployeeStatusChart
        :labels="statusLabels"
        :values="statusValues"
      />
    </div>
  </div>
</template>

<script setup>
import StatCard from '~/components/dashboard/StatCard.vue'
import DepartmentPieChart from '~/components/dashboard/DepartmentPieChart.vue'
import EmployeeStatusChart from '~/components/dashboard/EmployeeStatusChart.vue'

definePageMeta({
  middleware: ['auth']
})

const dashboard = useDashboardStore()

onMounted(() => {
  dashboard.fetchAll()
})

const departmentLabels = computed(() =>
  dashboard.employeesByDepartment.map(item => item.label)
)

const departmentValues = computed(() =>
  dashboard.employeesByDepartment.map(item => item.value)
)

const statusLabels = computed(() =>
  dashboard.employeesByStatus.map(item => item.label)
)

const statusValues = computed(() =>
  dashboard.employeesByStatus.map(item => item.value)
)
</script>