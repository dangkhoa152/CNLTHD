<template>
  <div class="flex justify-center mt-4 gap-2 items-center">
    
    <button
      @click="$emit('prev')"
      :disabled="currentPage === 1"
      class="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
    >
      ←
    </button>

    <button
      v-for="(page, index) in visiblePages"
      :key="index"
      @click="typeof page === 'number' && $emit('go-to', page)"
      :disabled="page === '...'"
      :class="[
        'px-3 py-1 border rounded transition-colors',
        page === currentPage ? 'bg-blue-500 text-white border-blue-500' : 'hover:bg-gray-50',
        page === '...' ? 'cursor-default border-none bg-transparent hover:bg-transparent' : ''
      ]"
    >
      {{ page }}
    </button>

    <button
      @click="$emit('next')"
      :disabled="currentPage >= totalPages || totalPages === 0"
      class="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
    >
      →
    </button>

  </div>
</template>

<script lang="ts" setup>
// 1. Khai báo các Props để nhận dữ liệu từ Component Cha
defineProps<{
  currentPage: number
  totalPages: number
  visiblePages: (number | string)[]
}>()

// 2. Khai báo các Emits để báo cáo hành động click chuột lên Component Cha
defineEmits(['prev', 'next', 'go-to'])
</script>