import { ref, watch } from 'vue'

/**
 * Composable để debounce value
 * @param {Ref} source - Giá trị cần debounce
 * @param {Number} delay - Độ trễ (ms)
 * @returns {Ref} Giá trị đã debounce
 */
export function useDebounce(source, delay = 500) {
  const debounced = ref(source.value)
  let timeout

  watch(source, (newVal) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      debounced.value = newVal
    }, delay)
  })

  return debounced
}
