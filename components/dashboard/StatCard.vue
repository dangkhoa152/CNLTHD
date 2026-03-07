<template>
  <div class="stat-card">
    <p class="label">{{ title }}</p>
    <h2 class="value">{{ value }}</h2>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: [String, Number]
})
</script>

<style scoped>
.stat-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
}

.label {
  color: #64748b;
  font-size: 14px;
  margin-bottom: 10px;
}

.value {
  color: #0f172a;
  font-size: 28px;
  font-weight: 700;
}
</style>