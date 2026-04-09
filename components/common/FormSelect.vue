<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" :for="id" class="text-sm font-semibold text-gray-700 dark:text-gray-300">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <select
      :id="id"
      :value="modelValue"
      :disabled="disabled"
      :required="required"
      @change="$emit('update:modelValue', $event.target.value)"
      @blur="$emit('blur')"
      @focus="$emit('focus')"
      :class="[
        'w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm',
        'bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
        'transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 dark:focus:ring-blue-400',
        'cursor-pointer',
        error && 'border-red-500 focus:ring-red-500 dark:border-red-500',
        disabled && 'opacity-50 cursor-not-allowed'
      ]"
    >
      <option v-if="placeholder" value="">{{ placeholder }}</option>
      <option v-for="opt in options" :key="opt.value !== undefined ? opt.value : opt" :value="opt.value !== undefined ? opt.value : opt">
        {{ opt.label !== undefined ? opt.label : opt }}
      </option>
    </select>
    <p v-if="error" class="text-xs text-red-500 dark:text-red-400">{{ error }}</p>
    <p v-if="hint && !error" class="text-xs text-gray-500 dark:text-gray-400">{{ hint }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: String, default: '' },
  options: { type: Array, required: true },
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  error: { type: String, default: '' },
  hint: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  id: { type: String, default: () => Math.random().toString(36).slice(2, 11) }
})

defineEmits(['update:modelValue', 'blur', 'focus'])
</script>