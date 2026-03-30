import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import getNowString from '~/utils/formatDate'
export const useLeaveRequestStore = defineStore('leaveRequest', () => {
    const leaveRequests = ref([])
    const loading = ref(false)
    const query = ref({})
    const sortColumn = ref('')
    const sortOrder = ref('asc')

    function saveToLocal() {
        if (process.client) {
            localStorage.setItem('hrm_leaveRequests', JSON.stringify(leaveRequests.value))
        }
    }

    function loadDataFromLocal() {
        if (process.client) {
            const data = localStorage.getItem('hrm_leaveRequests')
            leaveRequests.value = JSON.parse(data)
            return leaveRequests;
        }
        return null;
    }
    // lấy data từ file JSON 
    async function fetchLeaveRequests() {
        loading.value = true
        try {
            // Thử lấy từ LocalStorage trước
            const saved = process.client ? localStorage.getItem('hrm_leaveRequests') : null
            if (saved && JSON.parse(saved).length > 0) {
                leaveRequests.value = JSON.parse(saved)
            } else {
                const data = await $fetch('/data/leave-request.json')
                leaveRequests.value = data
                saveToLocal()
            }
        } catch (error) {
            console.error("Lỗi tải dữ liệu:", error)
        } finally {
            loading.value = false
        }
    }
    // Thêm mới đơn nghỉ phép
    function addLeaveRequest(payload) {
        try {
            const nextId = leaveRequests.value.length > 0
                ? Math.max(...leaveRequests.value.filter(a => a.id).map(a => Number(a.id))) + 1
                : 1;

            const item = {
                id: nextId,
                employeeName: payload.employeeName || '',
                employeeCode: payload.employeeCode || '',
                department: payload.department || '',
                fromDate: payload.fromDate || '',
                toDate: payload.toDate || '',
                days: payload.days || 1,
                reason: payload.reason || '',
                status: payload.status || 'Chờ duyệt',
                createdAt: getNowString(''),
                ...payload
            }
            // Thêm vào đầu danh sách
            leaveRequests.value.unshift(item)
            saveToLocal()
            return item
        }
        catch (error) {
            console.log('Lỗi khi thêm đơn nghỉ phép')
        }
    }
    // Sửa đơn nghỉ phép
    function updateLeaveRequest(id, patch) {
        const idx = leaveRequests.value.findIndex(i => i.id === id)
        if (idx !== -1) {
            // Cập nhật các trường được cung cấp trong patch
            Object.assign(leaveRequests.value[idx], patch)
            saveToLocal()
            return leaveRequests.value[idx]
        }
        return null
    }
    // Xóa đơn nghỉ phép
    function deleteLeaveRequest(id) {
        leaveRequests.value = leaveRequests.value.filter(i => i.id !== id)
        saveToLocal()
    }
    // Duyệt đơn nghỉ phép
    function approveLeaveRequest(id, approver = '') {
        const it = leaveRequests.value.find(i => i.id === id)
        if (it) {
            it.status = 'Đã duyệt'
            it.approvedBy = approver
            it.approvedAt = getNowString('')
            saveToLocal()
        }
    }
    // Từ chối đơn nghỉ phép
    function rejectLeaveRequest(id, reason = '', approver = '') {
        const it = leaveRequests.value.find(i => i.id === id)
        if (it) {
            it.status = 'Từ chối'
            it.rejectedBy = approver
            it.rejectedAt = getNowString('')
            if (reason) it.rejectionReason = reason
            saveToLocal()
        }
    }
    // Cập nhật trạng thái hàng loạt (duyệt hoặc từ chối nhiều đơn cùng lúc)
    function bulkUpdateStatus(ids = [], status = '', by = '') {
        ids.forEach(id => {
            const it = leaveRequests.value.find(i => i.id === id)
            if (it) {
                it.status = status
                if (status === 'Đã duyệt') {
                    it.approvedBy = by
                    it.approvedAt = getNowString('')
                } else if (status === 'Từ chối') {
                    it.rejectedBy = by
                    it.rejectedAt = getNowString('')
                }
            }
        })
        saveToLocal()
    }
    // Cập nhật filter/query để lọc danh sách từ components
    function setFilter(payload) {
        if (payload === undefined || payload === null) {
            query.value = {}
            return
        }
        query.value = { ...query.value, ...payload }
    }

    function clearFilter() {
        query.value = {}
    }
    // Tìm kiếm và lọc đơn nghỉ phép dựa trên query
    const searchLeaveRequest = computed(() => {
        return leaveRequests.value.filter(i => {
            const q = (query.value.query || '').toLowerCase()
            if (query.value.status && i.status !== query.value.status) return false
            if (query.value.department && i.department !== query.value.department) return false
            if (q) {
                return [i.employeeName, i.employeeCode, i.reason].join(' ').toLowerCase().includes(q)
            }
            return true
        })
    })

    function getAllRequestByEmpID(empID) {
        return leaveRequests.value.filter(item => String(item.employeeCode) === String(empID))
    }

    function setSort(column) {
        if (sortColumn.value === column) {
            sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
        } else {
            sortColumn.value = column
            sortOrder.value = 'asc'
        }
    }

    const sortedLeaveRequests = computed(() => {
        const result = [...searchLeaveRequest.value];
        if (!sortColumn.value) return result;

        return result.sort((a, b) => {
            let valA, valB;
            switch (sortColumn.value) {
                case 'employeeCode':
                    valA = a.employeeCode || '';
                    valB = b.employeeCode || '';
                    break;
                case 'fromDate':
                    // Chuyển string ngày tháng về số (Timestamp) để so sánh chính xác
                    valA = a.fromDate ? new Date(a.fromDate).getTime() : 0;
                    valB = b.fromDate ? new Date(b.fromDate).getTime() : 0;
                    break;
                case 'toDate':
                    valA = a.toDate ? new Date(a.toDate).getTime() : 0;
                    valB = b.toDate ? new Date(b.toDate).getTime() : 0;
                    break;
                default:
                    return 0;
            }
            if (typeof valA === 'string' && typeof valB === 'string') {
                valA = valA.toLowerCase();
                valB = valB.toLowerCase();
            } else {
                valA = new String(valA);
                valB = new String(valB);
            }

            if (valA < valB) return sortOrder.value === 'asc' ? -1 : 1;
            if (valA > valB) return sortOrder.value === 'asc' ? 1 : -1;
            return 0;
        });
    });


    return {
        leaveRequests,
        loading,
        loadDataFromLocal,
        searchLeaveRequest,
        query,
        sortColumn,
        sortOrder,
        setFilter,
        clearFilter,
        fetchLeaveRequests,
        saveToLocal,
        addLeaveRequest,
        updateLeaveRequest,
        deleteLeaveRequest,
        approveLeaveRequest,
        rejectLeaveRequest,
        bulkUpdateStatus,
        getAllRequestByEmpID,
        setSort,
        sortedLeaveRequests
    }
})
