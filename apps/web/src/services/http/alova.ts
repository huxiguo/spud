import type { Method } from 'alova'

import { createAlova } from 'alova'
import adapterFetch from 'alova/fetch'
import vueHook from 'alova/vue'
import { toast } from 'vue-sonner'

import { isNullOrEmptyString } from '@/lib/type-helper'
import { useAuthStore } from '@/stores/modules/auth'

const baseURL = import.meta.env.VITE_API_BASE_URL

export const alovaInstance = createAlova({
  baseURL,
  statesHook: vueHook,
  cacheLogger: false,
  cacheFor: null,
  requestAdapter: adapterFetch(),
  timeout: 10000,

  beforeRequest(method: Method) {
    const token = useAuthStore().token

    // 如果是 FormData，不设置 Content-Type，让浏览器自动设置 multipart/form-data
    const isFormData = method.data instanceof FormData

    method.config.headers = {
      ...method.config.headers,
      // 只有非 FormData 请求才设置 Content-Type
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    }

    if (isNullOrEmptyString(token) === false) {
      method.config.headers.Authorization = `Bearer ${token}`
    }
  },

  responded: {
    onSuccess: async (response: Response) => {
      if (response.status >= 200 && response.status < 300) {
        const data = await response.json()
        return data
      }

      toast.error(`HTTP Error: ${response.status}`)
      throw new Error(`HTTP Error: ${response.status}`)
    },

    onError: (error: Error) => {
      toast.error(`请求错误:${error.message}`)
      throw error
    },
  },
})
