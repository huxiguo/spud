import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref('')

  function $reset() {
    token.value = ''
  }

  return {
    token,
    $reset,
  }
})
