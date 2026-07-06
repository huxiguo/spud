import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useAuthStore = defineStore(
  'auth',
  () => {
    const token = ref<string>('')
    const permissions = ref<string[]>([])

    const setToken = (_token: string) => {
      token.value = _token
    }

    const setPermissions = (_permissions: string[]) => {
      permissions.value = _permissions
    }

    const $reset = () => {
      token.value = ''
      permissions.value = []
    }

    return {
      token,
      permissions,
      setToken,
      setPermissions,
      $reset,
    }
  },
  {
    // 添加持久化配置，确保刷新页面后token信息不丢失
    persist: true,
  },
)
