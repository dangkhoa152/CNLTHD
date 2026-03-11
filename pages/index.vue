<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-slate-800">Tổng quan Dashboard</h1>
      <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors shadow-sm">
        + Thêm nhân sự
      </button>
    </div>

    <div v-if="pending" class="text-slate-500 animate-pulse font-medium">
      Đang tải dữ liệu...
    </div>

    <div v-else-if="dashboardData">
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div class="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          </div>
          <div>
            <p class="text-sm font-medium text-slate-500">Tổng nhân sự</p>
            <p class="text-2xl font-bold text-slate-800">{{ dashboardData.totalEmployees }}</p>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div class="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
          </div>
          <div>
            <p class="text-sm font-medium text-slate-500">Nhân sự mới (tháng)</p>
            <p class="text-2xl font-bold text-slate-800">+{{ dashboardData.newEmployeesThisMonth }}</p>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div class="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <div>
            <p class="text-sm font-medium text-slate-500">Nghỉ phép hôm nay</p>
            <p class="text-2xl font-bold text-slate-800">{{ dashboardData.onLeaveToday }}</p>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div class="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          </div>
          <div>
            <p class="text-sm font-medium text-slate-500">Đơn chờ duyệt</p>
            <p class="text-2xl font-bold text-slate-800">{{ dashboardData.pendingLeaveRequests }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h2 class="text-lg font-bold text-slate-800 mb-4">Hoạt động gần đây</h2>
        <div class="space-y-4">
          <div v-for="activity in dashboardData.recentActivities" :key="activity.id" class="flex items-start gap-4 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
            <div class="w-2.5 h-2.5 mt-1.5 rounded-full bg-blue-500 shrink-0"></div>
            <div>
              <p class="text-slate-800 text-sm font-medium">
                {{ activity.user }} <span class="text-slate-500 font-normal">{{ activity.action }}</span>
              </p>
              <p class="text-xs text-slate-400 mt-1">{{ activity.time }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 1 DÒNG CODE DUY NHẤT LÀ ĐỦ: Dùng useFetch của Nuxt để kéo dữ liệu từ thư mục public/data
// - dashboardData: biến chứa dữ liệu JSON trả về
// - pending: biến boolean (true/false) báo hiệu dữ liệu đang tải hay đã xong
const { data: dashboardData, pending } = await useFetch('/data/dashboard.json')
</script>