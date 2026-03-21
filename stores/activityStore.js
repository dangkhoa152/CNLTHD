import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useActivityStore = defineStore('activity', () => {
  const activities = ref([])

  // Hàm load dữ liệu ban đầu (gọi từ file json của nhóm nếu localStorage trống)
  const fetchActivities = async () => {
    const storedData = localStorage.getItem('hr_activities')
    if (storedData) {
      activities.value = JSON.parse(storedData)
    } else {
      try {
        const data = await $fetch('/data/activities.json')
        // Đảm bảo data là mảng (nếu file json của bạn đang là 1 object thì biến thành mảng)
        if (data) {
          activities.value = Array.isArray(data) ? data : [data]
          localStorage.setItem('hr_activities', JSON.stringify(activities.value))
        }
      } catch (error) {
        console.error('Lỗi lấy dữ liệu activities:', error)
      }
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