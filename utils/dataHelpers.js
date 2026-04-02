// Hàm tiện ích set lại trạng thái sắp xếp khi người dùng click vào cột
export function toggleSortColumn(currentColumn, currentOrder, column) {
  if (currentColumn === column) {
    return currentOrder === 'asc' ? 'desc' : 'asc'
  }
  return 'asc'
}

// Hàm tiện ích để chuẩn hóa giá trị trước khi so sánh trong sắp xếp
export function normalizeSortValue(value) {
  if (value === undefined || value === null) return ''
  if (typeof value === 'string') return value.toLowerCase()
  return value
}

// Hàm tiện ích để sắp xếp một mảng theo cột và thứ tự, có thể tùy chỉnh cách lấy giá trị
export function sortArrayByValue(list, column, order = 'asc', getValue = item => item[column]) {
  if (!column) return [...list]
  // Tạo một bản sao của mảng để tránh thay đổi nguyên gốc
  const result = [...list]
  result.sort((a, b) => {
    let valueA = getValue(a)
    let valueB = getValue(b)
    // Chuẩn hóa giá trị để so sánh
    valueA = normalizeSortValue(valueA)
    valueB = normalizeSortValue(valueB)

    if (valueA < valueB) return order === 'asc' ? -1 : 1
    if (valueA > valueB) return order === 'asc' ? 1 : -1
    return 0
  })

  return result
}

// Hàm tiện ích để tạo ID mới có định dạng "PREFIX + số thứ tự", ví dụ "EMP01", "DEP02"
export function generateNextPrefixedId(items, prefix = '', digits = 2, idField = 'id') {
  const numbers = items.map(item => {
    const value = String(item[idField] ?? '')
    const match = value.match(new RegExp(`^${prefix}(\\d+)$`))
    return match ? Number(match[1]) : 0
  })

  const maxValue = numbers.length > 0 ? Math.max(...numbers) : 0
  return `${prefix}${String(maxValue + 1).padStart(digits, '0')}`
}
