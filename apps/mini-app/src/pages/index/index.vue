<script setup lang="ts">
definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '首页',
  },
})
</script>

<template>
  <scroll-view
    class="box-border min-h-0 flex-1 bg-[#f5f5f5] dark:bg-[#0f1724]"
    scroll-y
    :show-scrollbar="false"
    :enhanced="true"
  >
    首页
  </scroll-view>
</template>
