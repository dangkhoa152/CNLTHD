import { defineStore } from 'pinia'
import { ref } from 'vue'
import getNowString from '~/utils/formatDate'
import { loadLocalStorageJSON, loadOrFetchArray, saveLocalStorageJSON } from '~/utils/persistence'

export const useActivityStore = defineStore('activity', () => {
  const activities = ref([])
  const isLoading = ref(false)
  const auth = useAuthStore()
  function saveToLocal() {
    saveLocalStorageJSON('hr_activities', activities.value)
  }

  function loadFromLocal() {
    const saved = loadLocalStorageJSON('hr_activities', [])
    if (Array.isArray(saved) && saved.length > 0) {
      activities.value = saved
    }
  }

  const fetchActivities = async () => {
    isLoading.value = true
    try {
      activities.value = await loadOrFetchArray(
        'hr_activities',
        '/data/activities.json',
        [],
        false
      )
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error)
    } finally {
      isLoading.value = false
    }
  }

  // Hàm ghi nhận hoạt động mới (Khớp 100% với JSON của bạn)
  const logActivity = (type, title, target, user = auth.user.name) => {
    if (activities.value.length === 0) {
      loadFromLocal()
    }

    // Tự động tăng ID (Tìm id lớn nhất hiện tại rồi + 1)
    const nextId = activities.value.length > 0
      ? Math.max(...activities.value.map(a => a.id)) + 1
      : 1

    // Khởi tạo Object đúng chuẩn file activities.json
    const newLog = {
      id: nextId,
      type: type,
      title: title,
      user: user,
      target: target,
      time: getNowString('')
      
    }

    // 4. Đẩy lên đầu mảng và lưu localStorage
    activities.value.unshift(newLog)
    saveToLocal()
  }

  return { activities, fetchActivities, logActivity }
})