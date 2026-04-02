<template>
  <div class="flex flex-wrap items-center justify-center gap-2 mt-4">
    <button
      @click="$emit('prev')"
      :disabled="currentPage === 1"
      class="rounded-full border px-4 py-2 text-sm transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800"
    >
      ←
    </button>

    <button
      v-for="(page, index) in visiblePages"
      :key="index"
      @click="typeof page === 'number' && $emit('go-to', page)"
      :disabled="page === '...'"
      :class="[
        'rounded-full px-4 py-2 text-sm transition',
        page === currentPage ? 'bg-blue-600 text-white shadow' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800',
        page === '...' ? 'cursor-default border-none bg-transparent text-slate-400 hover:bg-transparent' : ''
      ]"
    >
      {{ page }}
    </button>

    <button
      @click="$emit('next')"
      :disabled="currentPage >= totalPages || totalPages === 0"
      class="rounded-full border px-4 py-2 text-sm transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800"
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