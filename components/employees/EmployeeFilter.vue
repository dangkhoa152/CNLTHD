<template>
  <div class="bg-white dark:bg-gray-800 p-4 rounded shadow-sm flex flex-col md:flex-row gap-3 items-center">
    <div class="flex-1 w-full md:w-auto">
    <!-- Ô input -->
        <input
        v-model="query"
        @input="emitFilter"
        type="text"
        placeholder="Tìm theo tên, mã nhân viên"
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
        <option value="Đang làm việc">Đang làm việc</option>
        <option value="Đã nghỉ việc">Đã nghỉ việc</option>
        <option value="Nghỉ phép">Nghỉ phép</option>
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
        <option v-for="d in departments" :key="d.name" :value="d.name">{{ d.name }}</option>
      </select>
    </div>
    <!-- Nút xóa bộ lọc -->
    <div>
      <button 
        @click="$emit('reset')" 
        class="bg-red-100 dark:bg-red-900 
      text-red-700 dark:text-red-200 px-4 py-2 rounded"
      >
      Reset
    </button>
    </div>
  </div>
</template>

<script setup>
    import { ref } from 'vue'
    //Định nghĩa props và định nghĩa các biến trạng thái cho bộ lọc
    const props = defineProps({
        departments: { type: Array, default: () => [] }
    })
    const emit = defineEmits(['filter-changed', 'reset'])
    const departmentURL = defineModel('department', { type: String, default: '' })
    const query = ref('')
    const status = ref('')
    const department = ref('')
    // Hàm gửi sự kiện khi có thay đổi trong bộ lọc
    function emitFilter() {
        emit('filter-changed', { query: query.value, status: status.value, department: department.value })
    }

</script>

<style scoped></style>
