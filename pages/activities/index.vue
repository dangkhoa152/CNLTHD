<script setup>
import { ref, onMounted, computed } from 'vue'
import { useActivityStore } from '@/stores/activityStore'
import getNowString from '~/utils/formatDate'
import Pagination from '~/components/common/Pagination.vue'

const activityStore = useActivityStore()

// 1. Tạo 2 biến lưu trạng thái của bộ lọc
const filterDate = ref('')
const filterType = ref('')

onMounted(() => {
  activityStore.fetchActivities()
})

// 2. Nâng cấp hàm computed để tự động lọc dữ liệu
const sortedActivities = computed(() => {
  let result = activityStore.activities

  // Lọc theo loại thao tác
  if (filterType.value) {
    result = result.filter(log => log.type === filterType.value)
  }

  // Lọc theo ngày (Vì thời gian lưu dạng "2026-03-28 13:45" nên ta dùng startsWith)
  if (filterDate.value) {
    result = result.filter(log => log.time.startsWith(filterDate.value))
  }

  return result
})

const {
  currentPage,
  totalPages,
  paginatedList,
  nextPage,
  prevPage,
  goToPage,
  visiblePages
} = usePagination(sortedActivities, 10)

const getTypeBadgeStyle = (type) => {
  switch (type) {
    case 'add': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
    case 'edit': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'delete': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'login': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    case 'theme': return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }
}

const getTypeText = (type) => {
  switch (type) {
    case 'add': return 'Thêm mới'
    case 'edit': return 'Cập nhật'
    case 'delete': return 'Xóa'
    case 'login': return 'Đăng nhập'
    case 'theme': return 'Đổi giao diện'
    default: return type
  }
}
</script>

<template>
  <div class="p-6">
    <div class="mb-6 rounded-[1.75rem] border border-gray-200 bg-white px-6 py-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <h2 class="text-3xl font-bold text-slate-900 dark:text-white">
        Nhật ký hoạt động hệ thống
      </h2>
      <p class="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
        Theo dõi toàn bộ thao tác của quản trị viên và người dùng với bộ lọc nhanh và bảng hoạt động dễ đọc.
      </p>
    </div>

    <div class="flex flex-col gap-4 mb-6 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      
      <div class="max-w-80 flex flex-col">
        <label class="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Lọc theo ngày</label>
        <input
          v-model="filterDate"
          type="date"
          class="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div class="max-w-80 flex flex-col">
        <label class="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Loại thao tác</label>
        <select
          v-model="filterType"
          class="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none min-w-[200px]"
        >
          <option value="">-- Tất cả thao tác --</option>
          <option value="add">Thêm mới</option>
          <option value="edit">Cập nhật</option>
          <option value="delete">Xóa</option>
          <option value="login">Đăng nhập</option>
          <option value="theme">Đổi giao diện</option>
        </select>
      </div>

      <div class="flex items-end">
        <button
          v-if="filterDate || filterType"
          @click="filterDate = ''; filterType = ''"
          class="px-4 py-2 text-sm font-bold text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
        >
          Xóa bộ lọc
        </button>
      </div>
    </div>
    <div class="bg-white dark:bg-slate-950 rounded-[1.5rem] shadow-sm overflow-hidden border border-gray-200 dark:border-slate-800">
      <div class="overflow-x-auto w-full">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th class="px-5 py-4 text-left text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Thời gian</th>
              <th class="px-5 py-4 text-left text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Người dùng</th>
              <th class="px-5 py-4 text-left text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Loại thao tác</th>
              <th class="px-5 py-4 text-left text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Hành động</th>
              <th class="px-5 py-4 text-left text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Đối tượng tác động</th>
            </tr>
          </thead>

          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
            <tr v-for="log in paginatedList" :key="log.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <td class="px-5 py-4 whitespace-nowrap text-base text-gray-700 dark:text-gray-300 font-mono">
                {{ log.time }}
              </td>
              <td class="px-5 py-4 whitespace-nowrap text-base font-semibold text-gray-900 dark:text-white">
                {{ log.user }}
              </td>
              <td class="px-5 py-4 whitespace-nowrap text-base">
                <span :class="`px-3 py-1 inline-flex text-xs font-bold rounded-full ${getTypeBadgeStyle(log.type)}`">
                  {{ getTypeText(log.type) }}
                </span>
              </td>
              <td class="px-5 py-4 whitespace-nowrap text-base text-gray-800 dark:text-gray-200">
                {{ log.title }}
              </td>
              <td class="px-5 py-4 whitespace-nowrap text-base font-bold text-gray-900 dark:text-white">
                {{ log.target || '-' }}
              </td>
            </tr>

            <tr v-if="sortedActivities.length === 0">
              <td colspan="5" class="px-6 py-12 text-center text-lg text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50">
                <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Không tìm thấy hoạt động nào phù hợp với bộ lọc.
              </td>
            </tr>
          </tbody>
        </table>
      </div> 
    </div>

    <Pagination
      :current-page="currentPage"
      :total-pages="totalPages"
      :visible-pages="visiblePages"
      @prev="prevPage"
      @next="nextPage"
      @go-to="goToPage"
    />
  </div>
</template>