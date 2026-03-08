# HR Management Dashboard (Frontend) - Công nghệ lập trình hiện đại

Dự án Dashboard Quản lý Nhân sự được xây dựng theo kiến trúc hiện đại với **Nuxt 3**, **Vue 3 (Composition API)** và **Tailwind CSS**. 

Hiện tại dự án đang hoạt động độc lập ở phía Frontend (SPA) và sử dụng Mock Data (từ các file JSON) để mô phỏng dữ liệu thực tế.

## 🛠 Yêu cầu hệ thống (Prerequisites)
Để chạy dự án mà không gặp lỗi môi trường, máy tính của bạn cần có:
* **Node.js**: Phiên bản `v20.18.0` trở lên (Khuyến nghị dùng bản LTS mới nhất).
* **Trình quản lý gói**: `npm` (được tích hợp sẵn khi cài Node.js).
* **Editor/IDE**: Khuyên dùng Visual Studio Code.
  * *Extensions cần thiết:* **Vue - Official** (đọc hiểu cú pháp Vue 3) và **Tailwind CSS IntelliSense**.
  * *Lưu ý:* Vui lòng gỡ hoặc tắt extension Vetur (nếu có) để tránh xung đột.

## 🚀 Hướng dẫn cài đặt và khởi chạy

**Bước 1: Clone dự án và cài đặt thư viện**
Mở terminal tại thư mục gốc của dự án và chạy lệnh sau để tải các thư viện cần thiết:

    `npm install`

**Bước 2: cài đặt thư viện Pinaa và tailwindcss cho nuxt**

    `npm install pinia @pinia/nuxt`

    `npm install -D @nuxtjs/tailwindcss`

**Bước 3: Khởi động Server Development**

    `npm run dev`

Sau khi terminal báo khởi chạy thành công, mở trình duyệt và truy cập vào đường dẫn: http://localhost:3000


## 📂 Cấu trúc thư mục cốt lõi
Dự án tuân thủ chuẩn auto-import của Nuxt 3:

* layouts/: Chứa bộ khung giao diện dùng chung (Sidebar, Header). Layout mặc định là default.vue.

* pages/: Chứa các màn hình chức năng. File routing sẽ được Nuxt tự động khởi tạo dựa trên cấu trúc thư mục này.

* public/data/: Nơi lưu trữ các file .json đóng vai trò là "Backend giả lập" (Mock Data) để đổ dữ liệu ra giao diện.

* components/: Nơi chứa các UI Component dùng chung (Nút, Bảng, Input...) được tái sử dụng nhiều lần.

## 💻 Công nghệ và Thư viện chính

* Framework: Nuxt 3 & Vue 3

* UI/Styling: Tailwind CSS

* State Management: Pinia