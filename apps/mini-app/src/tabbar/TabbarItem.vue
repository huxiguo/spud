<script setup lang="ts">
import type { CustomTabBarItemResolved } from './types'

defineProps<{
  item: CustomTabBarItemResolved
  /** 中间鼓包：大图标、不展示底部文案 */
  isBulge?: boolean
}>()
</script>

<template>
  <view
    class="relative flex flex-col items-center justify-center text-center"
    :class="isBulge ? '' : 'px-3'"
  >
    <view :class="[item.icon, isBulge ? 'text-80px' : 'text-20px']" />
    <view v-if="!isBulge" class="mt-2px text-10px">
      {{ item.text }}
    </view>
    <view v-if="item.badge">
      <template v-if="item.badge === 'dot'">
        <view class="absolute right-0 top-0 h-2 w-2 rounded-full bg-#f56c6c" />
      </template>
      <template v-else>
        <view
          class="absolute top-0 box-border h-5 min-w-5 center rounded-full bg-#f56c6c px-1 text-center text-xs text-white -right-3"
        >
          {{ item.badge > 99 ? '99+' : item.badge }}
        </view>
      </template>
    </view>
  </view>
</template>
