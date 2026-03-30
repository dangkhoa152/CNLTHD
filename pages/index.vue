<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Tổng quan hệ thống
      </h1>
      <p class="mt-2 text-gray-500 dark:text-gray-400">
        Theo dõi nhanh tình hình nhân sự của hệ thống
      </p>
    </div>

    <!-- Hàng 1 -->
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <div
        v-for="card in statCards"
        :key="card.title"
        class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
          {{ card.title }}
        </p>
        <h2 class="mt-3 text-3xl font-bold text-gray-900 dark:text-white">
          {{ card.value }}
        </h2>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {{ card.subtitle }}
        </p>
      </div>
    </div>

    <!-- Hàng 2 -->
    <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <!-- Quy mô nhân sự theo phòng ban -->
      <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            Quy mô nhân sự theo phòng ban
          </h2>
          <span class="text-sm text-gray-500 dark:text-gray-400">
            Bar chart
          </span>
        </div>

        <div class="h-[340px]">
          <ClientOnly>
            <Bar :data="departmentBarData" :options="barOptions" />
          </ClientOnly>
        </div>
      </div>

      <!-- Trạng thái duyệt đơn -->
      <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            Trạng thái duyệt đơn
          </h2>
          <span class="text-sm text-gray-500 dark:text-gray-400">
            Pie chart
          </span>
        </div>

        <div class="h-[340px]">
          <ClientOnly>
            <Pie :data="approvalPieData" :options="pieOptions" />
          </ClientOnly>
        </div>
      </div>
    </div>

    <!-- Hàng 3 -->
    <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <!-- Radar chart -->
      <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
              Cơ cấu vị trí theo phòng ban
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Đếm số lượng từng position theo phòng ban
            </p>
          </div>

          <select
            v-model="selectedDepartment"
            class="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option
              v-for="dept in departmentOptions"
              :key="dept.value"
              :value="dept.value"
            >
              {{ dept.label }}
            </option>
          </select>
        </div>

        <div class="h-[360px]">
          <ClientOnly>
            <Radar :data="radarData" :options="radarOptions" />
          </ClientOnly>
        </div>
      </div>

      <!-- Activity -->
      <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="mb-4 flex items-center justify-between">
          <div>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
              Hoạt động gần đây
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              5 hoạt động mới nhất
            </p>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="border-b border-gray-200 text-left dark:border-gray-800">
                <th class="pb-3 pr-4 font-semibold text-gray-700 dark:text-gray-300">Thời gian</th>
                <th class="pb-3 pr-4 font-semibold text-gray-700 dark:text-gray-300">Hành động</th>
                <th class="pb-3 pr-4 font-semibold text-gray-700 dark:text-gray-300">Người thực hiện</th>
                <th class="pb-3 font-semibold text-gray-700 dark:text-gray-300">Đối tượng</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in recentActivities"
                :key="index"
                class="border-b border-gray-100 align-top dark:border-gray-800"
              >
                <td class="py-3 pr-4 text-gray-600 dark:text-gray-400">
                  {{ formatDateTime(item.time) }}
                </td>
                <td class="py-3 pr-4 font-medium text-gray-900 dark:text-white">
                  {{ item.title || '--' }}
                </td>
                <td class="py-3 pr-4 text-gray-600 dark:text-gray-400">
                  {{ item.user || 'Admin HR' }}
                </td>
                <td class="py-3 text-gray-600 dark:text-gray-400">
                  {{ item.target || '--' }}
                </td>
              </tr>

              <tr v-if="recentActivities.length === 0">
                <td colspan="4" class="py-6 text-center text-gray-500 dark:text-gray-400">
                  Chưa có dữ liệu hoạt động
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { Bar, Pie, Radar } from 'vue-chartjs'
import { Chart as ChartJS, registerables } from 'chart.js'

import { useEmployeeStore } from '~/stores/employeeStore'
import { useDepartmentStore } from '~/stores/departmentStore'
import { useLeaveRequestStore } from '~/stores/leaveRequestStore'
import { useActivityStore } from '~/stores/activityStore'

ChartJS.register(...registerables)

definePageMeta({
  middleware: ['auth']
})

const employeeStore = useEmployeeStore()
const departmentStore = useDepartmentStore()
const leaveRequestStore = useLeaveRequestStore()
const activityStore = useActivityStore()

const { employees } = storeToRefs(employeeStore)
const { departments } = storeToRefs(departmentStore)
const { leaveRequests } = storeToRefs(leaveRequestStore)
const { activities } = storeToRefs(activityStore)

const selectedDepartment = ref('')

onMounted(async () => {
  await Promise.all([
    departmentStore.fetchDepartments(),
    employeeStore.fetchEmployees(),
    leaveRequestStore.fetchLeaveRequests(),
    activityStore.fetchActivities()
  ])

  if (!selectedDepartment.value && departments.value.length > 0) {
    selectedDepartment.value = String(
      departments.value[0]?.id ?? departments.value[0]?.name ?? ''
    )
  }
})

watch(
  () => departments.value,
  (list) => {
    if (!selectedDepartment.value && list.length > 0) {
      selectedDepartment.value = String(list[0]?.id ?? list[0]?.name ?? '')
    }
  },
  { immediate: true, deep: true }
)

const normalizeText = (value) => {
  return String(value ?? '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
}
const getStatusKey = (status) => {
  const s = normalizeText(status)

  if (s === 'cho duyet') return 'pending'
  if (s === 'da duyet') return 'approved'
  if (s === 'tu choi' || s === 'da tu choi') return 'rejected'

  return 'other'
}

const parseDateSafe = (value) => {
  if (!value) return null

  const date = new Date(value)
  if (!Number.isNaN(date.getTime())) return date

  if (typeof value === 'string') {
    const normalized = value.replace(' ', 'T')
    const fallback = new Date(normalized)
    if (!Number.isNaN(fallback.getTime())) return fallback
  }

  return null
}

const formatYMD = (value) => {
  const date = parseDateSafe(value)
  if (!date) return ''

  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')

  return `${yyyy}-${mm}-${dd}`
}

const todayYMD = computed(() => formatYMD(new Date()))

const sameDay = (value) => formatYMD(value) === todayYMD.value

const isDateInRange = (target, start, end) => {
  const targetDate = parseDateSafe(target)
  const startDate = parseDateSafe(start)
  const endDate = parseDateSafe(end)

  if (!targetDate || !startDate || !endDate) return false

  const t = new Date(targetDate)
  const s = new Date(startDate)
  const e = new Date(endDate)

  t.setHours(0, 0, 0, 0)
  s.setHours(0, 0, 0, 0)
  e.setHours(23, 59, 59, 999)

  return t >= s && t <= e
}

const toNumber = (value) => {
  if (typeof value === 'number') return value
  const cleaned = String(value ?? '0').replace(/[^\d.-]/g, '')
  return Number(cleaned || 0)
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(value)
}

const formatDateTime = (value) => {
  const date = parseDateSafe(value)
  if (!date) return '--'

  return new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date)
}

const getEmployeeDepartmentName = (employee) => {
  return (
    employee?.history?.[0]?.department ||
    employee?.department ||
    'Chưa phân phòng'
  )
}

const getEmployeeDepartmentId = (employee) => {
  return (
    employee?.history?.[0]?.departmentId ||
    employee?.departmentId ||
    ''
  )
}

const getEmployeePosition = (employee) => {
  return (
    employee?.history?.[0]?.position ||
    employee?.position ||
    'Khác'
  )
}

const totalEmployees = computed(() => employees.value.length)

const totalBudget = computed(() => {
  return departments.value.reduce((sum, dept) => {
    return sum + toNumber(dept.budget)
  }, 0)
})

const pendingRequestsToday = computed(() => {
  return leaveRequests.value.filter((request) => {
    return getStatusKey(request.status) === 'pending' && sameDay(request.createdAt)
  }).length
})

const employeesOnLeaveToday = computed(() => {
  return leaveRequests.value.filter((request) => {
    return (
      getStatusKey(request.status) === 'approved' &&
      isDateInRange(new Date(), request.fromDate, request.toDate)
    )
  }).length
})

const statCards = computed(() => [
  {
    title: 'Tổng nhân viên',
    value: totalEmployees.value.toLocaleString('vi-VN'),
    subtitle: 'Từ employee store'
  },
  {
    title: 'Tổng ngân sách',
    value: formatCurrency(totalBudget.value),
    subtitle: 'Tổng budget từ department store'
  },
  {
    title: 'Tổng đơn chờ duyệt',
    value: pendingRequestsToday.value.toLocaleString('vi-VN'),
    subtitle: `Trong ngày ${todayYMD.value}`
  },
  {
    title: 'Số nhân viên đang nghỉ phép',
    value: employeesOnLeaveToday.value.toLocaleString('vi-VN'),
    subtitle: 'Đơn đã duyệt và còn hiệu lực hôm nay'
  }
])

const departmentCounts = computed(() => {
  const map = new Map()

  departments.value.forEach((dept) => {
    map.set(dept.name, 0)
  })

  employees.value.forEach((employee) => {
    const deptName = getEmployeeDepartmentName(employee)
    map.set(deptName, (map.get(deptName) || 0) + 1)
  })

  return Array.from(map.entries())
})

const departmentBarData = computed(() => ({
  labels: departmentCounts.value.map(([label]) => label),
  datasets: [
    {
      label: 'Số nhân viên',
      data: departmentCounts.value.map(([, count]) => count),
      backgroundColor: [
        '#60A5FA',
        '#34D399',
        '#FBBF24',
        '#F87171',
        '#A78BFA',
        '#22D3EE'
      ],
      borderRadius: 8
    }
  ]
}))

const approvalStatusCounts = computed(() => {
  let pending = 0
  let approved = 0
  let rejected = 0

  leaveRequests.value.forEach((request) => {
    const statusKey = getStatusKey(request.status)

    if (statusKey === 'pending') pending += 1
    else if (statusKey === 'approved') approved += 1
    else if (statusKey === 'rejected') rejected += 1
  })

  return { pending, approved, rejected }
})

const approvalPieData = computed(() => ({
  labels: ['Chờ duyệt', 'Đã duyệt', 'Đã từ chối'],
  datasets: [
    {
      data: [
        approvalStatusCounts.value.pending,
        approvalStatusCounts.value.approved,
        approvalStatusCounts.value.rejected
      ],
      backgroundColor: ['#FBBF24', '#34D399', '#F87171']
    }
  ]
}))

const departmentOptions = computed(() => {
  return departments.value.map((dept) => ({
    value: String(dept.id ?? dept.name),
    label: dept.name
  }))
})

const selectedDepartmentName = computed(() => {
  const found = departments.value.find(
    (dept) => String(dept.id ?? dept.name) === String(selectedDepartment.value)
  )
  return found?.name ?? ''
})

const employeesOfSelectedDepartment = computed(() => {
  return employees.value.filter((employee) => {
    const byId = String(getEmployeeDepartmentId(employee)) === String(selectedDepartment.value)
    const byName =
      normalizeText(getEmployeeDepartmentName(employee)) ===
      normalizeText(selectedDepartmentName.value)

    return byId || byName
  })
})

const positionCountMap = computed(() => {
  const map = new Map()

  employeesOfSelectedDepartment.value.forEach((employee) => {
    const position = getEmployeePosition(employee)
    map.set(position, (map.get(position) || 0) + 1)
  })

  if (map.size === 0) {
    map.set('Chưa có dữ liệu', 0)
  }

  return map
})

const radarData = computed(() => ({
  labels: Array.from(positionCountMap.value.keys()),
  datasets: [
    {
      label: selectedDepartmentName.value || 'Phòng ban',
      data: Array.from(positionCountMap.value.values()),
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      borderColor: '#3B82F6',
      pointBackgroundColor: '#2563EB',
      pointBorderColor: '#2563EB',
      pointRadius: 4
    }
  ]
}))

const recentActivities = computed(() => {
  return [...activities.value]
    .sort((a, b) => {
      const aTime = parseDateSafe(a.time)?.getTime() || 0
      const bTime = parseDateSafe(b.time)?.getTime() || 0
      return bTime - aTime
    })
    .slice(0, 5)
})

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        precision: 0
      }
    }
  }
}

const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom'
    }
  }
}

const radarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    r: {
      beginAtZero: true,
      ticks: {
        precision: 0
      }
    }
  },
  plugins: {
    legend: {
      position: 'bottom'
    }
  }
}
</script>