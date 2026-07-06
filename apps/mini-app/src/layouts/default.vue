<script setup lang="ts"></script>

<template>
  <view
    class="min-h-[calc(100vh-50px-env(safe-area-inset-bottom))] w-full flex flex-col bg-gray-50 dark:bg-[#121212]"
  >
    <view class="min-h-0 flex flex-1 flex-col">
      <slot />
    </view>
  </view>
</template>
