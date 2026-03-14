<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

// dữ liệu nhân viên
const employees = ref([])
const searchQuery = ref('')
const route = useRoute()

// load dữ liệu khi mở trang
onMounted(async () => {
  try {
    const data = await $fetch('/data/employees.json')
    employees.value = data
  } catch (error) {
    console.error('Lỗi tải nhân viên:', error)
  }
})

// lọc theo phòng ban từ query (?dept=IT)
const deptFilter = computed(() => route.query.dept)

// lọc theo phòng ban + search
const filteredEmployees = computed(() => {
  let list = employees.value

  // lọc phòng ban
  if (deptFilter.value) {
    list = list.filter(emp => emp.departmentId === deptFilter.value)
  }

  // search
  if (searchQuery.value) {
    const keyword = searchQuery.value.toLowerCase()

    list = list.filter(emp =>
      emp.name.toLowerCase().includes(keyword) ||
      emp.id.toLowerCase().includes(keyword) ||
      emp.position.toLowerCase().includes(keyword)
    )
  }

  return list
})

// format tiền
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value)
}
</script>

<template>
<div class="p-6">

  <div class="flex justify-between items-center mb-6">
    <h2 class="text-2xl font-bold text-gray-800 dark:text-white">
      Trang quản lý nhân viên
    </h2>

    <input
      v-model="searchQuery"
      type="text"
      placeholder="Tìm nhân viên..."
      class="border px-4 py-2 rounded-lg dark:bg-gray-800 dark:text-white"
    />
  </div>

  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">

    <table class="min-w-full divide-y divide-gray-300 dark:divide-gray-700">

      <thead class="bg-gray-100 dark:bg-gray-900">
        <tr>
          <th class="px-6 py-4 text-left">ID</th>
          <th class="px-6 py-4 text-left">Mã nhân viên</th>
          <th class="px-6 py-4 text-left">Tên</th>
          <th class="px-6 py-4 text-left">Giới tính</th>
          <th class="px-6 py-4 text-left">Ngày sinh</th>
          <th class="px-6 py-4 text-left">Email</th>
          <th class="px-6 py-4 text-left">Số điện thoại</th>
          <th class="px-6 py-4 text-left">Địa chỉ</th>
          <th class="px-6 py-4 text-left">Phòng ban</th>
          <th class="px-6 py-4 text-left">Chức vụ</th>
          <th class="px-6 py-4 text-left">Trạng thái</th>
          <th class="px-6 py-4 text-left">Ngày vào làm</th>
          <th class="px-6 py-4 text-left">Avatar</th>
        </tr>
      </thead>

      <tbody>

        <tr
          v-for="emp in filteredEmployees"
          :key="emp.id"
          class="hover:bg-gray-50 dark:hover:bg-gray-700"
        >

          <td class="px-6 py-4">{{ emp.id }}</td>

          <td class="px-6 py-4 font-bold">
            {{ emp.name }}
          </td>

          <td class="px-6 py-4">
            {{ emp.employeeCode }}
          </td>

          <td class="px-6 py-4">
            {{ emp.name }}
          </td>

          <td class="px-6 py-4">
            {{emp.gender}}
          </td>

          <td class="px-6 py-4">
            {{emp.dateOfBirth}}
          </td>

          <td class="px-6 py-4">
            {{emp.email }}
          </td>

          <td class="px-6 py-4">
            {{emp.phone}}
          </td>

          <td class="px-6 py-4">
            {{emp.address}}
          </td>

          <td class="px-6 py-4">
            {{emp.departmentId}}
          </td>

          <td class="px-6 py-4">
            {{emp.department}}
          </td>

          <td class="px-6 py-4">
            {{emp.position}}
          </td>

          <td class="px-6 py-4">
            {{emp.status}}
          </td>

          <td class="px-6 py-4">
            {{emp.joinDate}}
          </td>

          <td class="px-6 py-4">
            {{emp.avatar}}
          </td>
        </tr>

        <tr v-if="filteredEmployees.length === 0">
          <td colspan="5" class="text-center py-8 text-gray-500">
            Không tìm thấy nhân viên
          </td>
        </tr>

      </tbody>

    </table>

  </div>

</div>
</template>