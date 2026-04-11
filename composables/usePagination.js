import { ref, computed, watch } from 'vue'

/**
 * Hàm hỗ trợ phân trang tái sử dụng (JS Version)
 * @param {Ref} dataList - Mảng dữ liệu cần phân trang (dạng Ref)
 * @param {Number} defaultItemsPerPage - Số lượng item trên mỗi trang
 */
export function usePagination(dataList, defaultItemsPerPage = 12) {
  const currentPage = ref(1)
  const itemsPerPage = ref(defaultItemsPerPage)
  const totalPages = computed(() => {
    return Math.ceil(dataList.value.length / itemsPerPage.value)
  })
//  Tính toán danh sách item hiển thị trên trang hiện tại
  const paginatedList = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return dataList.value.slice(start, end)
  })
  // Các hàm điều hướng
  function nextPage() {
    if (currentPage.value < totalPages.value) {
      currentPage.value++
    }
  }
  function prevPage() {
    if (currentPage.value > 1) {
      currentPage.value--
    }
  }
  function goToPage(page) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }
  // Reset về trang 1 nếu dữ liệu gốc bị thay đổi (khi lọc hoặc xóa)
  watch(dataList, () => {
    currentPage.value = 1
  }, { deep: true })
  // Tạo mảng hiển thị số trang có dấu "..."
  const visiblePages = computed(() => {
    const pages = []
    const total = totalPages.value
    const current = currentPage.value
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1)
    }
    pages.push(1)
    if (current > 4) {
      pages.push('...')
    }
    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)
    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) pages.push(i)
    }

    if (current < total - 3) {
      pages.push('...')
    }

    if (!pages.includes(total)) pages.push(total)

    return pages
  })

  return {
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedList,
    nextPage,
    prevPage,
    goToPage,
    visiblePages
  }
}
