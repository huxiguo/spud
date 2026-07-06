import AdapterUniapp from '@alova/adapter-uniapp'
import { createAlova } from 'alova'
import VueHook from 'alova/vue'

import { useAuthStore } from '@/store'
import { isNullOrEmptyString } from '@/utils/string-helper'
import { toLoginPage } from '@/utils/toLoginPage'

const DEFAULT_ERROR_MESSAGE = '请求失败，请稍后重试'
const NETWORK_ERROR_MESSAGE = '网络异常，请稍后重试'
const TIMEOUT_ERROR_MESSAGE = '请求超时，请稍后重试'

// 是否正在重定向到登录页
let isLoginRedirecting = false

function showErrorToast(message: string) {
  uni.showToast({
    title: message,
    icon: 'none',
  })
}

function getResponseMessage(rawData: unknown) {
  if (rawData && typeof rawData === 'object' && 'message' in rawData) {
    const message = (rawData as { message?: unknown }).message
    if (typeof message === 'string' && isNullOrEmptyString(message) === false) {
      return message
    }
  }

  return DEFAULT_ERROR_MESSAGE
}

/**
 * alova 请求实例
 */
const alovaInstance = createAlova({
  baseURL: import.meta.env.VITE_SERVER_BASEURL,
  ...AdapterUniapp(),
  timeout: 5000,
  statesHook: VueHook,

  beforeRequest: (method) => {
    const authStore = useAuthStore()
    const token = authStore.token

    // 小程序环境无全局 FormData，需用 globalThis 取类再 instanceof，避免 ReferenceError
    const GlobalFormData = globalThis.FormData
    const isFormData =
      typeof GlobalFormData !== 'undefined' && method.data instanceof GlobalFormData

    method.config.headers = {
      ...method.config.headers,
      // 只有非 FormData 请求才设置 Content-Type
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    }

    // 添加 Authorization header
    if (isNullOrEmptyString(token) === false) {
      method.config.headers.Authorization = `Bearer ${token}`
    }
  },

  responded: {
    onSuccess: (response, method) => {
      const { config } = method
      const { requestType } = config

      if (config.requestType === 'upload' || config.requestType === 'download') {
        return response
      }

      // 这里再缩小类型
      const requestResponse = response as UniNamespace.RequestSuccessCallbackResult

      const { statusCode, data: rawData } = requestResponse

      // 处理特殊请求类型（上传/下载）
      if (requestType === 'upload' || requestType === 'download') {
        return response
      }

      const { success, message } = rawData as {
        success: boolean
        message: string
        data: any
      }

      if (statusCode >= 200 && statusCode < 300) {
        if (success !== true) {
          const errorMessage = isNullOrEmptyString(message) ? DEFAULT_ERROR_MESSAGE : message
          showErrorToast(errorMessage)
          throw new Error(errorMessage)
        }

        return rawData
      }

      const errorMessage = getResponseMessage(rawData)

      if (statusCode === 401) {
        const authStore = useAuthStore()
        authStore.$reset()

        if (!isLoginRedirecting) {
          isLoginRedirecting = true
          toLoginPage()
          setTimeout(() => {
            isLoginRedirecting = false
          }, 1000)
        }

        throw new Error(errorMessage || '登录已过期，请重新登录')
      }

      showErrorToast(errorMessage)
      throw new Error(errorMessage)
    },

    onError: (error: Error) => {
      const message = error.message.includes('timeout')
        ? TIMEOUT_ERROR_MESSAGE
        : NETWORK_ERROR_MESSAGE
      showErrorToast(message)
      throw error
    },
  },
})

export const http = alovaInstance
