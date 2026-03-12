<template>
  <div class="bg-white dark:bg-gray-800 p-4 rounded shadow-sm flex flex-col md:flex-row gap-3 items-center">
    <div class="flex-1 w-full md:w-auto">
    <!-- Ô input -->
        <input
        v-model="query"
        @input="emitFilter"
        type="text"
        placeholder="Tìm theo tên, mã nhân viên, lý do..."
        class="w-full border rounded px-3 py-2 focus:outline-none
        bg-white dark:bg-gray-700 
        text-gray-900 dark:text-gray-100 
        border-gray-200 dark:border-gray-600"
      />
    </div>
    <!-- Dropdown trạng thái -->
    <div>
      <select v-model="status" @change="emitFilter" 
        class="border rounded px-3 py-2
        bg-white dark:bg-gray-700
        text-gray-900 dark:text-gray-100
        border-gray-200 dark:border-gray-600">
        <option value="">Tất cả trạng thái</option>
        <option value="Chờ duyệt">Chờ duyệt</option>
        <option value="Đã duyệt">Đã duyệt</option>
        <option value="Đã từ chối">Đã từ chối</option>
      </select>
    </div>
    <!-- Dropdown phòng ban -->
    <div>
      <select v-model="department" @change="emitFilter"
        class="border rounded px-3 py-2 
      bg-white dark:bg-gray-700 
      text-gray-900 dark:text-gray-100 
      border-gray-200 dark:border-gray-600">
        <option value="">Tất cả phòng ban</option>
        <option v-for="d in departments" :key="d" :value="d">{{ d }}</option>
      </select>
    </div>
    <!-- Nút xóa bộ lọc -->
    <div>
      <button @click="clear" 
        class="bg-red-100 dark:bg-red-900 
      text-red-700 dark:text-red-200 px-4 py-2 rounded">
      Xóa
    </button>
    </div>
  </div>
</template>

<script setup>
    import { ref } from 'vue'
    // Lấy danh sách phòng ban từ props và định nghĩa các biến trạng thái cho bộ lọc
    const props = defineProps({
        departments: { type: Array, default: () => [] }
    })
    const emit = defineEmits(['filter-changed'])

    const query = ref('')
    const status = ref('')
    const department = ref('')
    // Hàm gửi sự kiện khi có thay đổi trong bộ lọc
    function emitFilter() {
        emit('filter-changed', { query: query.value, status: status.value, department: department.value })
    }

    function clear() {
        query.value = ''
        status.value = ''
        department.value = ''
        emitFilter()
    }
</script>

<style scoped></style>
