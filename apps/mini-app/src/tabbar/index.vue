<script setup lang="ts">
// 引入用到的 UnoCSS 图标类名，避免被 purge；也可在 uno.config safelist 中配置
// i-carbon-home i-carbon-menu i-carbon-user
import { tabbarList, tabbarStore } from './store'
import TabbarItem from './TabbarItem.vue'

// #ifdef MP-WEIXIN
defineOptions({
  virtualHost: true,
})
// #endif

/**
 * 中间鼓包 tab 的点击（不切换页面，由业务自行处理）
 */
function handleClickBulge() {
  uni.showToast({
    title: '点击了中间的鼓包tabbarItem',
    icon: 'none',
  })
}

function handleClick(index: number) {
  if (index === tabbarStore.curIdx) {
    return
  }
  const list = tabbarList.value
  if (!list[index]) {
    return
  }
  if (list[index].isBulge) {
    handleClickBulge()
    return
  }
  const url = list[index].pagePath
  tabbarStore.setCurIdx(index)
  uni.switchTab({ url })
}

function tabItemTextClass(index: number) {
  return tabbarStore.curIdx === index
    ? 'text-primary font-semibold'
    : 'text-gray-800 dark:text-gray-200'
}
</script>

<template>
  <view class="h-50px pb-safe">
    <view
      class="fixed bottom-0 left-0 right-0 z-1000 box-border border-t border-gray-300/90 bg-gray-200 shadow-[0_-5px_16px_-4px_rgba(15,23,42,0.1),0_-2px_8px_-2px_rgba(15,23,42,0.08),0_-1px_0_rgba(15,23,42,0.06)] dark:border-gray-600 dark:bg-[#182131] dark:shadow-[0_-6px_20px_-4px_rgba(0,0,0,0.45),0_-3px_10px_-3px_rgba(0,0,0,0.35),0_-1px_0_rgba(255,255,255,0.06)]"
      @touchmove.stop.prevent
    >
      <view class="h-50px flex items-center">
        <view
          v-for="(item, index) in tabbarList"
          :key="index"
          class="flex flex-1 flex-col items-center justify-center transition-colors duration-200"
          :class="tabItemTextClass(index)"
          @click="handleClick(index)"
        >
          <view v-if="item.isBulge" class="relative">
            <view
              class="absolute -top-5 left-1/2 center h-[250rpx] w-[250rpx] origin-top rounded-full bg-gray-100 shadow-[0_8px_20px_-8px_rgba(15,23,42,0.22),0_4px_12px_-6px_rgba(15,23,42,0.16),inset_0_0_0_1px_#94a3b8] transform-[translateX(-50%)_scale(0.5)_translateY(-33%) dark:bg-[#182131] dark:shadow-[0_10px_24px_-8px_rgba(0,0,0,0.5),0_4px_14px_-8px_rgba(0,0,0,0.4),inset_0_0_0_1px_#475569]"
            >
              <TabbarItem :item="item" class="text-center" is-bulge />
            </view>
          </view>
          <TabbarItem v-else :item="item" class="relative px-3 text-center" />
        </view>
      </view>

      <view class="pb-safe" />
    </view>
  </view>
</template>
