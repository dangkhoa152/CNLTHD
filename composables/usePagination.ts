import { ref, computed, watch, type Ref } from 'vue'

/**
 * Hàm hỗ trợ phân trang tái sử dụng
 * @param dataList 
 * @param defaultItemsPerPage
 */
export function usePagination<T>(dataList: Ref<T[]>, defaultItemsPerPage = 12) {
  const currentPage = ref(1)
  const itemsPerPage = ref(defaultItemsPerPage)

  // 1. Tính tổng số trang
  const totalPages = computed(() => {
    return Math.ceil(dataList.value.length / itemsPerPage.value)
  })

  // 2. Lấy dữ liệu của trang hiện tại
  const paginatedList = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return dataList.value.slice(start, end)
  })

  // 3. Các hàm điều hướng
  function nextPage() {
    if (currentPage.value < totalPages.value) currentPage.value++
  }

  function prevPage() {
    if (currentPage.value > 1) currentPage.value--
  }

  // Bổ sung thêm hàm nhảy đến một trang bất kỳ (rất tiện cho sau này)
  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  // 4. Reset về trang 1 nếu dữ liệu gốc bị thay đổi (ví dụ: khi người dùng bấm Lọc)
  watch(dataList, () => {
    currentPage.value = 1
  }, { deep: true })

  const visiblePages = computed(() => {
    const pages = []
    const total = totalPages.value
    const current = currentPage.value

    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1)
    }

    pages.push(1)

    if (current > 3) {
      pages.push('...')
    }

    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (current < total - 2) {
      pages.push('...')
    }

    pages.push(total)

    return pages
  })

  // Trả về những biến và hàm cần thiết để các Component khác sử dụng
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