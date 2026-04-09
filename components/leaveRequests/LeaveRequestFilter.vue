<template>
  <div class="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col gap-3 md:flex-row md:items-end">
    <div class="flex-1 min-w-0">
      <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Tìm kiếm</label>
      <div class="relative">
        <span class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="M21 21l-4.35-4.35"></path></svg>
        </span>
        <input
          v-model="query"
          type="text"
          placeholder="Tên, mã nhân viên, lý do..."
          class="w-full rounded-2xl border border-gray-200 bg-slate-50 px-10 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        />
      </div>
    </div>

    <div class="min-w-[140px] flex-1 md:flex-none">
      <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Ngày gửi</label>
      <input 
        v-model="createdAt" 
        type="date"
        class="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:ring-blue-500"
      />
    </div>    

    <div class="min-w-[140px]">
      <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Trạng thái</label>
      <select v-model="status"
        class="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:ring-blue-500">
        <option value="">Tất cả trạng thái</option>
        <option value="Chờ duyệt">Chờ duyệt</option>
        <option value="Đã duyệt">Đã duyệt</option>
        <option value="Từ chối">Từ chối</option>
      </select>
    </div>

    <div class="min-w-[140px]">
      <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Phòng ban</label>
      <select v-model="department"
        class="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:ring-blue-500">
        <option value="">Tất cả phòng ban</option>
        <option v-for="d in departments" :key="d" :value="d">{{ d }}</option>
      </select>
    </div>

    <div class="flex items-end">
      <button @click="clear" class="w-full rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
        Xóa bộ lọc
      </button>
    </div>
  </div>
</template>

<script setup>
    import { ref, watch } from 'vue'
    import { useDebounce } from '~/composables/useDebounce'
    const props = defineProps({
        departments: { type: Array, default: () => [] }
    })
    const emit = defineEmits(['filter-changed', 'reset'])

    const query = ref('')
    const status = ref('')
    const department = ref('')
    const createdAt = ref('')
    
    const debouncedQuery = useDebounce(query, 300)
 
    watch([debouncedQuery, status, department, createdAt], () => {
        emitFilter()
    })
    
    function emitFilter() {
        emit('filter-changed', { query: query.value, status: status.value, department: department.value, createdAt: createdAt.value})
    }

    function clear() {
        query.value = ''
        status.value = ''
        department.value = ''
        createdAt.value = ''
        emit('reset')
    }
</script>

<style scoped></style>
