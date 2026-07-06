<script lang="ts" setup>
// 启动页
import { onLoad } from '@dcloudio/uni-app'

import { LOGIN_PAGE } from '@/router/config'
import { useAuthStore } from '@/store/auth'
import { TABBAR_FALLBACK_PAGE } from '@/tabbar/config'
import { getDefaultTabbarPagePath } from '@/tabbar/store'

defineOptions({
  name: 'Dispatcher',
})

definePage({
  type: 'home',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '启动中',
  },
})

const authStore = useAuthStore()

function goHome() {
  uni.switchTab({ url: getDefaultTabbarPagePath() })
}

onLoad(() => {
  if (!authStore.token) {
    uni.reLaunch({
      url: `${LOGIN_PAGE}?redirect=${encodeURIComponent(TABBAR_FALLBACK_PAGE)}`,
    })
    return
  }

  // 刷新权限和帐号信息
})
</script>

<template>
  <view
    class="min-h-screen flex flex-col items-center justify-center bg-white px-6 dark:bg-[#0f1724]"
  >
    <image
      src="https://coconut-bucket.yugps.com/static/images/logo.png"
      mode="aspectFill"
      class="h-24 w-24 rounded-3xl shadow-md border border-slate-100 dark:border-slate-800 mb-6"
    />
    <view class="text-lg font-semibold text-slate-700 dark:text-slate-100">万程</view>
    <view class="mt-2 text-sm text-slate-400 dark:text-slate-500">正在进入应用...</view>
  </view>
</template>
