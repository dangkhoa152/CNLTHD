<template>
    <div v-if="item" class="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
      <div class="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" @click="$emit('close')"></div>
      <div class="relative z-10 w-full max-w-3xl overflow-hidden rounded-[1.75rem] bg-white dark:bg-slate-950 shadow-2xl">
        <div class="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="text-sm font-semibold uppercase tracking-[0.28em] text-blue-600 dark:text-blue-400">Đơn nghỉ phép</p>
            <h3 class="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Chi tiết đơn #{{ item.id }}</h3>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{ item.employeeName }} — {{ item.employeeCode }}</p>
          </div>
          <div class="flex items-center gap-3">
            <span :class="badgeClass(item.status)" class="inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold">{{ item.status }}</span>
            <button @click="$emit('close')" aria-label="Đóng" class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:text-white transition">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

      <div class="grid grid-cols-1 gap-3">
        <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-3 bg-gray-50 dark:bg-gray-900 rounded">
            <dt class="text-xs text-gray-500">Phòng ban</dt>
            <dd class="mt-1 font-medium">{{ item.department || '-' }}</dd>
          </div>
          <div class="p-3 bg-gray-50 dark:bg-gray-900 rounded">
            <dt class="text-xs text-gray-500">Khoảng</dt>
            <dd class="mt-1 font-medium">{{ fmtDate(item.fromDate) }} → {{ fmtDate(item.toDate) }}</dd>
          </div>
          <div class="p-3 bg-gray-50 dark:bg-gray-900 rounded">
            <dt class="text-xs text-gray-500">Số ngày</dt>
            <dd class="mt-1 font-medium">{{ item.days }}</dd>
          </div>
          <div class="p-3 bg-gray-50 dark:bg-gray-900 rounded">
            <dt class="text-xs text-gray-500">Ngày tạo</dt>
            <dd class="mt-1 font-medium">{{ fmtDate(item.createdAt) }}</dd>
          </div>
        </dl>

        <div class="mt-3 p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded">
          <dt class="text-xs text-gray-500">Lý do</dt>
          <dd class="mt-2 text-sm text-gray-700 dark:text-gray-200">{{ item.reason || '-' }}</dd>
        </div>
      </div>

      <div class="mt-6 flex justify-end gap-2">
        <button v-if="item.status==='Chờ duyệt' && !editing" @click="$emit('approve', item)" class="bg-green-600 dark:bg-green-700 text-white px-4 py-2 rounded">Duyệt</button>
        <button v-if="item.status==='Chờ duyệt' && !editing" @click="$emit('reject', item)" class="bg-red-600 dark:bg-red-700 text-white px-4 py-2 rounded">Từ chối</button>
        <button v-if="!editing" @click="$emit('close')" class="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2 rounded">Đóng</button>

        <div v-if="editing" class="flex items-center gap-2">
          <button @click="save" class="bg-green-600 dark:bg-green-700 text-white px-4 py-2 rounded">Lưu</button>
          <button @click="cancel" class="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2 rounded">Hủy</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
    import { reactive, ref, watch } from 'vue'

    const props = defineProps({ item: { type: Object, default: null } })
    const emit = defineEmits(['close', 'approve', 'reject', 'update'])

    const editing = ref(false)

    const form = reactive({
      fromDate: '',
      toDate: '',
      days: 1,
      reason: '',
      status: ''
    })

    watch(() => props.item, (v) => {
      if (v) {
        form.fromDate = v.fromDate || ''
        form.toDate = v.toDate || ''
        form.days = v.days || 1
        form.reason = v.reason || ''
        form.status = v.status || ''
        editing.value = false
      }
    })

    function cancel(){
      if (props.item) {
        form.fromDate = props.item.fromDate || ''
        form.toDate = props.item.toDate || ''
        form.days = props.item.days || 1
        form.reason = props.item.reason || ''
        form.status = props.item.status || ''
      }
      editing.value = false;
      
    }

    function save(){
      if (!props.item) return
      const patch = {
        fromDate: form.fromDate,
        toDate: form.toDate,
        days: form.days,
        reason: form.reason,
        status: form.status
      }
      emit('update', { id: props.item.id, patch })
      editing.value = false
      emit('close')
    }

    function fmtDate(d){
      if(!d) return '-'
      try {
        const dt = new Date(d)
        return dt.toLocaleDateString()
      } catch(e){
        return d
      }
    }

    function badgeClass(s){
      if(!s) return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
      if(s==='Đã duyệt') return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
      if(s==='Từ chối') return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
      return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
    }
</script>

<style scoped></style>
