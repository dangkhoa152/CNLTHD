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

  // Trả về những biến và hàm cần thiết để các Component khác sử dụng
  return {
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedList,
    nextPage,
    prevPage,
    goToPage
  }
}