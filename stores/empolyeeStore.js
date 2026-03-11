import { defineStore } from 'pinia'

export const useEmployeeStore = defineStore('employee', () => {
  // 1. STATE (Trạng thái lưu trữ)
  const employees = ref([])
  const isLoading = ref(false)
  
  // Trạng thái cho Data Grid
  const searchQuery = ref('')
  const sortBy = ref('name') // Cột đang sắp xếp
  const sortDesc = ref(false) // Tăng dần hay giảm dần
  const currentPage = ref(1)
  const itemsPerPage = ref(10)

  // Hàm gọi dữ liệu
  const fetchEmployees = async () => {
    isLoading.value = true
    try {
      const data = await $fetch('/data/employees.json')
      employees.value = data
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu nhân viên:', error)
    } finally {
      setTimeout(() => { isLoading.value = false }, 500)
    }
  }

  // 3. GETTERS (Xử lý Lọc -> Sắp xếp -> Phân trang tại Client bằng Computed)
  const processedEmployees = computed(() => {
    let result = employees.value

    // Lọc theo tên hoặc email
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      result = result.filter(emp => 
        emp.personalInfo.fullName.toLowerCase().includes(q) ||
        emp.personalInfo.email.toLowerCase().includes(q)
      )
    }

    // Sắp xếp (Sort)
    result = result.sort((a, b) => {
      let valA = a.personalInfo.fullName.toLowerCase()
      let valB = b.personalInfo.fullName.toLowerCase()
      
      if (valA < valB) return sortDesc.value ? 1 : -1
      if (valA > valB) return sortDesc.value ? -1 : 1
      return 0
    })

    // Phân trang (Pagination)
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    
    return result.slice(start, end)
  })

  const totalPages = computed(() => {
    // Tính tổng số trang dựa trên dữ liệu đã LỌC
    const filteredCount = searchQuery.value 
      ? employees.value.filter(emp => emp.personalInfo.fullName.toLowerCase().includes(searchQuery.value.toLowerCase())).length 
      : employees.value.length
    
    return Math.ceil(filteredCount / itemsPerPage.value)
  })

  // Trả ra các biến và hàm để Component sử dụng
  return {
    employees, isLoading, searchQuery, sortBy, sortDesc, currentPage, itemsPerPage,
    fetchEmployees, processedEmployees, totalPages
  }
})