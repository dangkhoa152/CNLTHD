<template>
  <span class="inline-flex items-center justify-center ml-1 w-4 h-4 transition-colors">
<!-- Mui ten len: A-Z -->
    <svg v-if="isActive && sortOrder === 'asc'" class="w-3.5 h-3.5 text-blue-600 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 15l7-7 7 7"></path>
    </svg>
<!-- Mui ten xuong : Z-A -->
    <svg v-else-if="isActive && sortOrder === 'desc'" class="w-3.5 h-3.5 text-blue-600 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7"></path>
    </svg>
<!-- Mui ten 2 chieu: trang thai cho -->
    <svg v-else class="w-3.5 h-3.5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path>
    </svg> 
    
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  column: String,
  sortColumn: String,
  sortOrder: String
})

const isActive = computed(() => props.column === props.sortColumn)
</script>