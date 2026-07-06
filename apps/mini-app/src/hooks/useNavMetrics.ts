import { computed } from 'vue'

export function useNavMetrics() {
  const navMetrics = computed(() => {
    const systemInfo = uni.getSystemInfoSync()
    const windowWidth = systemInfo.windowWidth || 375
    const statusBarHeight = systemInfo.statusBarHeight || 0
    const menuButtonInfo =
      typeof wx !== 'undefined' && typeof wx.getMenuButtonBoundingClientRect === 'function'
        ? wx.getMenuButtonBoundingClientRect()
        : {
            top: statusBarHeight,
            height: 32,
            width: 95,
            left: windowWidth - 107,
            right: windowWidth - 12,
          }
    const menuButtonHeight = menuButtonInfo.height || 32
    const menuButtonWidth = menuButtonInfo.width || 95
    const menuButtonRight = menuButtonInfo.right || windowWidth - 12
    const menuButtonLeft = menuButtonInfo.left || menuButtonRight - menuButtonWidth
    const gap = menuButtonInfo.top - statusBarHeight
    const navBarHeight = menuButtonHeight + gap * 2
    const totalNavHeight = statusBarHeight + navBarHeight

    return {
      statusBarHeight,
      navBarHeight,
      totalNavHeight,
      menuButtonHeight,
      menuButtonLeft,
      menuButtonRight,
      menuButtonWidth,
    }
  })

  return {
    navMetrics,
  }
}
