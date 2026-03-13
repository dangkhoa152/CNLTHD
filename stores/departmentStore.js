import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useDepartmentStore = defineStore('department', () => {
  // 1. State
  const departments = ref([])
  const searchQuery = ref('')
  
  // FIX 1: Đổi mặc định thành true. 
  // Để khi F5, giao diện luôn hiện "Đang tải..." trước, chặn việc in ra lỗi "Không tìm thấy".
  const isLoading = ref(true) 

  // 2. Actions: Lấy dữ liệu từ file JSON tĩnh
  const fetchDepartments = async () => {
    // TỐI ƯU UX: Nếu mảng đã có dữ liệu rồi thì không cần gọi lại API nữa.
    // Giúp người dùng chuyển qua lại giữa trang Nhân viên và Phòng ban cực kỳ mượt mà.
    if (departments.value.length > 0) {
      isLoading.value = false
      return
    }

    isLoading.value = true
    try {
      // FIX 2: Bắt buộc dùng $fetch trong Pinia thay vì useFetch. 
      // Hàm $fetch trả về thẳng data (không cần data.value)
      const data = await $fetch('/data/departments.json')
      
      if (data) {
        departments.value = data
      }
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu phòng ban:', error)
    } finally {
      isLoading.value = false
    }
  }

  const deleteDepartment = (deptId) => {
    // Lọc bỏ phòng ban có id trùng với id cần xóa
    departments.value = departments.value.filter(dep => dep.id !== deptId)
  }

  // 3. Getters: Tự động lọc danh sách khi có từ khóa tìm kiếm
  const filteredDepartments = computed(() => {
    if (!searchQuery.value) return departments.value

    const query = searchQuery.value.toLowerCase()
    return departments.value.filter(dep => 
      dep.name.toLowerCase().includes(query) || 
      dep.manager.toLowerCase().includes(query) ||
      dep.id.toLowerCase().includes(query)
    )
  })

  return { 
    departments, 
    searchQuery, 
    isLoading, 
    fetchDepartments, 
    filteredDepartments,
    deleteDepartment
  }
})