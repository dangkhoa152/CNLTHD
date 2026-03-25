import getNowString from '~/utils/formatDate'
export const useLeaveRequestStore = defineStore('leaveRequest', () => {
    const leaveRequests = ref([])
    const loading = ref(false)
    const query = ref({})

    const dashboard = useDashboardStore()
    const auth = useAuthStore()
    const activityStore = useActivityStore()

    // Định dạng ngày tháng hiện tại thành chuỗi
    // function getNowString() {
    //     const now = new Date()
    //     const yyyy = now.getFullYear()
    //     const mm = String(now.getMonth() + 1).padStart(2, '0')
    //     const dd = String(now.getDate()).padStart(2, '0')
    //     const hh = String(now.getHours()).padStart(2, '0')
    //     const mi = String(now.getMinutes()).padStart(2, '0')
    //     return `${yyyy}-${mm}-${dd} ${hh}:${mi}`
    // }
    // Lưu data vào LocalStorage

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
                ? Math.max(...leaveRequests.value.map(a => a.id)) + 1
                : 1
            const item = {
                nextId,
                employeeName: payload.employeeName || '',
                employeeCode: payload.employeeCode || '',
                department: payload.department || '',
                fromDate: payload.fromDate || '',
                toDate: payload.toDate || '',
                days: payload.days || 1,
                reason: payload.reason || '',
                status: payload.status || 'Chờ duyệt',
                createdAt: getNowString(),
                ...payload
            }
            // Thêm vào đầu danh sách
            leaveRequests.value.unshift(item)
            saveToLocal()
            const userName = auth.user.name || 'Admin HR';
            dashboard.addActivity({ type: 'add', title: `Tạo đơn nghỉ phép cho ${payload.employeeName}`, user: userName })
            activityStore.logActivity('add', 'Tạo đơn xin nghỉ', payload.employeeName)
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
            it.approvedAt = getNowString()
            saveToLocal()
        }
    }
    // Từ chối đơn nghỉ phép
    function rejectLeaveRequest(id, reason = '', approver = '') {
        const it = leaveRequests.value.find(i => i.id === id)
        if (it) {
            it.status = 'Đã từ chối'
            it.rejectedBy = approver
            it.rejectedAt = getNowString()
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
                    it.approvedAt = getNowString()
                } else if (status === 'Đã từ chối') {
                    it.rejectedBy = by
                    it.rejectedAt = getNowString()
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

    const total = computed(() => leaveRequests.value.length)

    return {
        leaveRequests,
        loading,
        loadDataFromLocal,
        searchLeaveRequest,
        query,
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
        total,
    }
})
