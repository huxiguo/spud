<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { useConfigProvider } from '@wot-ui/ui'
import { ref } from 'vue'

import FgTabbar from '@/tabbar/index.vue'

import { useTheme } from './hooks/useTheme'
import { isPageTabbar } from './tabbar/store'
import { currRoute } from './utils'

const { themeVars, isDark } = useTheme()

useConfigProvider({ themeVars: themeVars.value })

const isCurrentPageTabbar = ref(true)

onShow(() => {
  const { path } = currRoute()
  // 所以这里需要判断一下，如果是 '/' 就当做首页，也要显示 tabbar
  if (path === '/') {
    isCurrentPageTabbar.value = true
  } else {
    isCurrentPageTabbar.value = isPageTabbar(path)
  }
})
</script>

<template>
  <wd-config-provider :theme-vars="themeVars" :theme="isDark ? 'dark' : 'light'">
    <!-- 启用unocss 的深色模式 -->
    <view :class="{ dark: isDark ? true : false }">
      <KuRootView />
      <FgTabbar v-if="isCurrentPageTabbar" />
    </view>
  </wd-config-provider>
</template>
