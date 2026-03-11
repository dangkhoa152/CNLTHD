<template>
  <div class="flex h-screen bg-slate-50 font-sans text-slate-900">
    <aside class="w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm">
      <div class="h-16 flex items-center px-6 border-b border-slate-200">
        <div class="flex items-center gap-2 text-blue-600 font-bold text-xl">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
          <span>HRM System</span>
        </div>
      </div>

      <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <NuxtLink to="/" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors" exact-active-class="bg-blue-50 text-blue-700 font-medium">
          Tổng quan
        </NuxtLink>
        <NuxtLink to="/employees" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors" active-class="bg-blue-50 text-blue-700 font-medium">
          Nhân viên
        </NuxtLink>
        <NuxtLink to="/departments" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors" active-class="bg-blue-50 text-blue-700 font-medium">
          Phòng ban
        </NuxtLink>
        <NuxtLink to="/attendance" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors" active-class="bg-blue-50 text-blue-700 font-medium">
          Chấm công
        </NuxtLink>
        <NuxtLink to="/leave-requests" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors" active-class="bg-blue-50 text-blue-700 font-medium">
          Đơn từ
        </NuxtLink>
        <NuxtLink to="/payroll" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors" active-class="bg-blue-50 text-blue-700 font-medium">
          Bảng lương
        </NuxtLink>
      </nav>

      <div class="p-4 border-t border-slate-200">
        <button class="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
          Đăng xuất
        </button>
      </div>
    </aside>

    <div class="flex-1 flex flex-col overflow-hidden">
      
      <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 shadow-sm z-10">
        <h2 class="text-lg font-semibold text-slate-800">Bảng điều khiển</h2>

        <div class="flex items-center gap-4">
          <button class="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
            <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div class="flex items-center gap-3 border-l border-slate-200 pl-4 cursor-pointer">
            <div class="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              C
            </div>
            <div class="flex flex-col">
              <span class="text-sm font-semibold text-slate-700">Chiến</span>
              <span class="text-xs text-slate-500">HR Manager</span>
            </div>
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-auto p-6">
        <slot />
      </main>

    </div>
  </div>
</template>

<script setup lang="ts">
// Logic xử lý chung cho toàn bộ layout (nếu có)
</script>