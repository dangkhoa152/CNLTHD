import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import getNowString from '~/utils/formatDate'
import { loadLocalStorageJSON, loadOrFetchArray, saveLocalStorageJSON } from '~/utils/persistence'
import { sortArrayByValue, toggleSortColumn } from '~/utils/dataHelpers'

export const useLeaveRequestStore = defineStore('leaveRequest', () => {
    const leaveRequests = ref([])
    const loading = ref(false)
    const query = ref({})
    const sortColumn = ref('')
    const sortOrder = ref('asc')
    const employeeStore = useEmployeeStore()

    // Lưu data vào LocalStorage
    function saveToLocal() {
        saveLocalStorageJSON('hrm_leaveRequests', leaveRequests.value)
    }

    // Load data từ LocalStorage (nếu có) 
    function loadDataFromLocal() {
        const data = loadLocalStorageJSON('hrm_leaveRequests', [])
        if (Array.isArray(data)) {
            leaveRequests.value = data
        }
        return leaveRequests
    }

    // Fetch data từ file JSON (có cache vào localStorage)
    async function fetchLeaveRequests() {
        loading.value = true
        try {
            leaveRequests.value = await loadOrFetchArray(
                'hrm_leaveRequests',
                '/data/leave-request.json',
                [],
                false
            )
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
                updatedAt: getNowString(''),
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
    function approveLeaveRequest(id, approverName) {
        const it = leaveRequests.value.find(i => i.id === id)
        if (it) {
            it.status = 'Đã duyệt'
            it.approver = approverName
            it.updatedAt = getNowString('')
            const emp = employeeStore.employees.find(emp => String(emp.employeeCode) === String(it.employeeCode))
            if(emp) {
                emp.status = 'Nghỉ phép'
                employeeStore.saveToLocal()
            }

            saveToLocal()
        }
    }

    // Từ chối đơn nghỉ phép
    function rejectLeaveRequest(id, approverName, rejectReason) {
        const it = leaveRequests.value.find(i => i.id === id)
        if (it) {
            it.status = 'Từ chối'
            it.approver = approverName
            it.rejectionReason = rejectReason || ''
            it.updatedAt = getNowString('')
            saveToLocal()
        }
    }

    // Cập nhật trạng thái hàng loạt (duyệt hoặc từ chối nhiều đơn cùng lúc)
    function bulkUpdateStatus(ids = [], status, by, rejectReason) {
        ids.forEach(id => {
            const it = leaveRequests.value.find(i => i.id === id)
            if (it) {
                it.status = status
                if (status === 'Đã duyệt') {
                    it.approver = by
                    it.updatedAt = getNowString('')
                } else if (status === 'Từ chối') {
                    it.approver = by
                    it.updatedAt = getNowString('')
                    it.rejectionReason = rejectReason || 'Không đủ nhân sự thay thế'
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

    // Xóa filter 
    function clearFilter() {
        query.value = {}
    }

    // Tìm kiếm và lọc đơn nghỉ phép dựa trên query
    const searchLeaveRequest = computed(() => {
    return leaveRequests.value.filter(i => {
        if (query.value.status && i.status !== query.value.status) return false;
        if (query.value.department && i.department !== query.value.department) return false;

        if (query.value.createdAt) {
            const itemDateObj = new Date(i.createdAt);
            const itemDateStr = getNowString(itemDateObj);
            if (itemDateStr !== getNowString(query.value.createdAt)) return false;
        }
        const q = (query.value.query || '').toLowerCase().trim();
        if (q) {
            return [i.employeeName, i.employeeCode, i.reason].join(' ').toLowerCase().includes(q);
        }

        // Đạt mọi điều kiện
        return true;
    });
});
    function getAllRequestByEmpID(empID) {
        return leaveRequests.value.filter(item => String(item.employeeCode) === String(empID))
    }

    // Thiết lập sắp xếp khi người dùng click vào header cột
    function setSort(column) {
        sortOrder.value = toggleSortColumn(sortColumn.value, sortOrder.value, column)
        sortColumn.value = column
    }

    // Kết quả sau khi đã được lọc và sắp xếp
    const sortedLeaveRequests = computed(() => {
        const result = [...searchLeaveRequest.value]
        if (!sortColumn.value) return result

        const getValue = (item) => {
            switch (sortColumn.value) {
                case 'fromDate':
                    return item.fromDate ? new Date(item.fromDate).getTime() : 0
                case 'toDate':
                    return item.toDate ? new Date(item.toDate).getTime() : 0
                default:
                    return item[sortColumn.value] || ''
            }
        }

        return sortArrayByValue(result, sortColumn.value, sortOrder.value, getValue)
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
