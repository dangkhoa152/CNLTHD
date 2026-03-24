import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useActivityStore = defineStore('activity', () => {
  const activities = ref([])
  const isLoading = ref(false)

  function saveToLocal() {
    if (process.client) {
      localStorage.setItem('hr_activities', JSON.stringify(activities.value))
    }
  }

  function loadFromLocal() {
    if (process.client) {
      const saved = localStorage.getItem('hr_activities')
      if (saved) activities.value = JSON.parse(saved)
    }
  }

  // Hàm load dữ liệu ban đầu (gọi từ file json của nhóm nếu localStorage trống)
  const fetchActivities = async () => {
    isLoading.value = true
    try {
      // Thử lấy từ LocalStorage trước
      const saved = process.client ? localStorage.getItem('hr_activities') : null
      if (saved && JSON.parse(saved).length > 0) {
        // Nếu có dữ liệu cũ trong máy thì dùng luôn
        activities.value = JSON.parse(saved)
      } else {
        const data = await $fetch('/data/activities.json')
        activities.value = data
        saveToLocal()
      }
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error)
    } finally {
      isLoading.value = false
    }
  }

  // Hàm ghi nhận hoạt động mới (Khớp 100% với JSON của bạn)
  const logActivity = (type, title, target, user = 'Admin HR') => {
    // 1. Tự động tăng ID (Tìm id lớn nhất hiện tại rồi + 1)
    const nextId = activities.value.length > 0
      ? Math.max(...activities.value.map(a => a.id)) + 1
      : 1

    // 2. Format thời gian chuẩn "YYYY-MM-DD HH:mm"
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}`

    // 3. Khởi tạo Object đúng chuẩn file activities.json
    const newLog = {
      id: nextId,
      type: type,
      title: title,
      user: user,
      target: target,
      time: formattedTime
    }

    // 4. Đẩy lên đầu mảng và lưu localStorage
    activities.value.unshift(newLog)
    localStorage.setItem('hr_activities', JSON.stringify(activities.value))
  }

  return { activities, fetchActivities, logActivity }
})