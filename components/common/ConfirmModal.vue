<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4 transition-opacity">
    
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all">
      
      <div class="p-6 text-center">
        <div 
          class="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
          :class="type === 'danger' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'"
        >
          <svg v-if="type === 'danger'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        </div>

        <h3 class="text-lg font-bold text-gray-900 mb-2">{{ title }}</h3>
        <p class="text-sm text-gray-500">{{ message }}</p>
      </div>

      <div class="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
        <button 
          @click="$emit('cancel')" 
          class="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium transition-colors"
        >
          {{ cancelText }}
        </button>
        <button 
          @click="$emit('confirm')" 
          class="px-4 py-2 text-white rounded-md font-medium shadow-sm transition-colors"
          :class="type === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-yellow-600 hover:bg-yellow-700'"
        >
          {{ confirmText }}
        </button>
      </div>

    </div>
  </div>
</template>

<script lang="ts" setup>
// Khai báo các Props để tùy biến Modal từ bên ngoài
defineProps({
  isOpen: { type: Boolean, default: false },
  title: { type: String, default: 'Xác nhận' },
  message: { type: String, default: 'Bạn có chắc chắn muốn thực hiện hành động này?' },
  confirmText: { type: String, default: 'Xác nhận' },
  cancelText: { type: String, default: 'Hủy' },
  type: { type: String, default: 'danger' } // Nhận 2 giá trị: 'danger' hoặc 'warning'
})

// Khai báo 2 sự kiện trả về cho Component Cha
defineEmits(['confirm', 'cancel'])
</script>