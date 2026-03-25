<template>
    <div v-if="item" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black opacity-40" @click="$emit('close')"></div>
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl p-6 z-10">
      <div class="flex items-start justify-between mb-4">
        <div>
          <h3 class="text-lg font-semibold">Chi tiết đơn</h3>
          <div class="text-sm text-gray-500 dark:text-gray-400">{{ item.employeeName }} — {{ item.employeeCode }}</div>
        </div>
        <div class="flex items-center gap-3">
          <span :class="badgeClass(item.status)" class="px-3 py-1 rounded-full text-sm font-medium">{{ item.status }}</span>
          <button @click="$emit('close')" aria-label="Close" class="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300">×</button>
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
      editing.value = false
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
      if(s==='Đã từ chối') return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
      return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
    }
</script>

<style scoped></style>
