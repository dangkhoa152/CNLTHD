<template>
    <div v-if="item" class="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
      <div class="absolute inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity" @click="$emit('close')"></div>
      <div class="relative z-10 w-full max-w-3xl overflow-hidden rounded-[1.75rem] bg-white dark:bg-slate-950 shadow-2xl">
        
        <div class="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-slate-950">
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

        <div class="p-6 grid grid-cols-1 gap-4 overflow-y-auto max-h-[60vh] custom-scrollbar">
          <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
              <dt class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Phòng ban</dt>
              <dd class="mt-1 font-semibold text-gray-900 dark:text-white">{{ item.department || '-' }}</dd>
            </div>
            <div class="px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
              <dt class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Khoảng thời gian</dt>
              <dd class="mt-1 font-semibold text-gray-900 dark:text-white">{{ getNowString(item.fromDate) }} → {{ getNowString(item.toDate) }}</dd>
            </div>
            <div class="px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
              <dt class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Số ngày nghỉ</dt>
              <dd class="mt-1 font-semibold text-blue-600 dark:text-blue-400">{{ item.days }} ngày</dd>
            </div>
            <div class="px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
              <dt class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ngày nộp đơn</dt>
              <dd class="mt-1 font-semibold text-gray-900 dark:text-white">{{ fmtDate(item.createdAt) }}</dd>
            </div>
            <div class="px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
              <dt class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Người duyệt/từ chối</dt>
              <dd class="mt-1 font-semibold text-gray-900 dark:text-white">{{ item.approver || 'Chưa cập nhật' }}</dd>
            </div>
            <div class="px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
              <dt class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cập nhật lần cuối</dt>
              <dd class="mt-1 font-semibold text-gray-900 dark:text-white">{{ fmtDate(item.updatedAt) || 'Chưa cập nhật' }}</dd>
            </div>
          </dl>

          <div class="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
            <dt class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Lý do xin nghỉ</dt>
            <dd class="mt-2 text-sm text-gray-800 dark:text-gray-200 leading-relaxed">{{ item.reason || '-' }}</dd>
          </div>

          <div v-if="item.status === 'Từ chối' || item.status === 'Đã từ chối'" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl">
            <dt class="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">Lý do từ chối</dt>
            <dd class="mt-2 text-sm text-red-700 dark:text-red-300 leading-relaxed font-medium">{{ item.rejectionReason || 'Không có ghi chú' }}</dd>
          </div>
        </div>

        <div v-if="isRejecting" class="px-6 pb-2">
          <label class="block text-sm font-semibold text-red-600 dark:text-red-400 mb-2">Vui lòng nhập lý do từ chối <span class="text-red-500">*</span></label>
          <textarea v-model="form.rejectionReason" rows="2" placeholder="Ví dụ: Công việc đang nhiều, không đủ nhân sự backup..." class="w-full rounded-xl border border-red-300 focus:ring-2 focus:ring-red-500 p-3 outline-none dark:bg-gray-900 dark:border-red-800 dark:text-white transition-colors resize-none"></textarea>
          <p v-if="rejectError" class="text-sm text-red-500 mt-2 font-medium">{{ rejectError }}</p>
        </div>

        <div class="px-6 pb-6 pt-2 flex justify-end gap-3 bg-white dark:bg-slate-950">
          
          <template v-if="!isRejecting">
            <button v-if="item.status === 'Chờ duyệt'" @click="confirmApprove" class="bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-600 text-white px-5 py-2.5 rounded-xl font-medium transition-colors">Duyệt đơn</button>
            <button v-if="item.status === 'Chờ duyệt'" @click="startReject" class="bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-600 text-white px-5 py-2.5 rounded-xl font-medium transition-colors">Từ chối</button>
            <button @click="$emit('close')" class="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 px-5 py-2.5 rounded-xl font-medium transition-colors">Đóng</button>
          </template>

          <template v-if="isRejecting">
            <button @click="confirmReject" class="bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-600 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm">Xác nhận từ chối</button>
            <button @click="cancelReject" class="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 px-5 py-2.5 rounded-xl font-medium transition-colors">Hủy thao tác</button>
          </template>

        </div>
      </div>
    </div>
</template>

<script setup>
    import { reactive, ref, watch } from 'vue'
    import getNowString from '@/utils/formatDate'
    const props = defineProps({ item: { type: Object, default: null } })
    const emit = defineEmits(['close', 'approve', 'reject', 'update'])

    const isRejecting = ref(false) 
    const rejectError = ref('')   

    const form = reactive({
      fromDate: '',
      toDate: '',
      days: 1,
      reason: '',
      status: '',
      rejectionReason: '' 
    })

    watch(() => props.item, (v) => {
      if (v) {
        form.fromDate = v.fromDate || ''
        form.toDate = v.toDate || ''
        form.days = v.days || 1
        form.reason = v.reason || ''
        form.status = v.status || ''
        form.rejectionReason = v.rejectionReason || ''
        isRejecting.value = false
        rejectError.value = ''
      }
    }, { immediate: true })

    function confirmApprove() {
      const updatedItem = {
        ...props.item,
      }
      emit('approve', updatedItem)
    }

    function startReject() {
      isRejecting.value = true
      rejectError.value = ''
      form.rejectionReason = ''
    }

    function cancelReject() {
      isRejecting.value = false
      rejectError.value = ''
      form.rejectionReason = ''
    }

    function confirmReject() {
      if (!form.rejectionReason || !form.rejectionReason.trim()) {
        rejectError.value = 'Vui lòng nhập lý do từ chối để nhân sự nắm thông tin!'
        return
      }
      const updatedItem = {
        ...props.item,
        rejectionReason: form.rejectionReason.trim()
      }
      emit('reject', updatedItem)     
      isRejecting.value = false
    }

    function cancel(){
      if (props.item) {
        form.fromDate = props.item.fromDate || ''
        form.toDate = props.item.toDate || ''
        form.days = props.item.days || 1
        form.reason = props.item.reason || ''
        form.status = props.item.status || ''
        form.rejectionReason = props.item.rejectionReason || ''
      }
    }

    function save(){
      if (!props.item) return
      const patch = {
        fromDate: form.fromDate,
        toDate: form.toDate,
        days: form.days,
        reason: form.reason,
        status: form.status,
        rejectionReason: form.rejectionReason
      }
      emit('update', { id: props.item.id, patch })
      editing.value = false
      emit('close')
    }

    function fmtDate(d){
      if(!d) return '-'
      try {
        const dt = new Date(d)
        const hours = String(dt.getHours()).padStart(2, '0')
        const minutes = String(dt.getMinutes()).padStart(2, '0')
        const day = String(dt.getDate()).padStart(2, '0')
        const month = String(dt.getMonth() + 1).padStart(2, '0')
        const year = dt.getFullYear()
        return `${hours}:${minutes} - ${day}/${month}/${year}`
      } catch(e){
        return d
      }
    }

    function badgeClass(s){
      if(!s) return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700'
      if(s === 'Đã duyệt') return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/50'
      if(s === 'Từ chối' || s === 'Đã từ chối') return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/50'
      return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800/50'
    }
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
</style>