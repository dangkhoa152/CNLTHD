// Hàm tiện ích để parse JSON với fallback nếu có lỗi hoặc giá trị null/undefined
export function parseJSON(value, fallback = null) {
  if (value === null || value === undefined) return fallback
  try {
    return JSON.parse(value)
  } catch (error) {
    console.error('JSON parse error:', error)
    return fallback
  }
}

// Hàm tiện ích để load dữ liệu JSON từ localStorage, có kiểm tra lỗi và fallback
export function loadLocalStorageJSON(key, fallback = null) {
  if (!process.client) return fallback
  return parseJSON(localStorage.getItem(key), fallback)
}

// Lưu vào localStorage dưới dạng JSON, có kiểm tra lỗi
export function saveLocalStorageJSON(key, value) {
  if (!process.client) return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Failed to save ${key} to localStorage:`, error)
  }
}

// Hàm tiện ích để load hoặc fetch từ URL nếu không có hoặc forceRefresh = true
export async function loadOrFetchArray(key, url, fallback = [], forceRefresh = false) {
  if (!forceRefresh && process.client) {
    const cached = loadLocalStorageJSON(key, null)
    if (Array.isArray(cached) && cached.length > 0) {
      return cached
    }
  }

  const data = await $fetch(url)
  const items = Array.isArray(data) ? data : fallback
  saveLocalStorageJSON(key, items)
  return items
}
