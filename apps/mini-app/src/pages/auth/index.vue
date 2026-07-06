<script setup lang="ts">
definePage(() => {
  return {
    layout: 'detail',
    style: {
      navigationStyle: 'custom',
      navigationBarTitleText: '登录',
    },
  }
})
</script>

<template>
  <view class="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-white dark:bg-[#1a1a1a]">
    <wd-navbar
      fixed
      placeholder
      safe-area-inset-top
      :bordered="false"
      custom-class="!bg-white dark:!bg-[#1a1a1a]"
    />
    登录
  </view>
</template>
