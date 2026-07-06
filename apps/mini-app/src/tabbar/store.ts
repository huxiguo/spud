import { storeToRefs } from 'pinia'
import { computed, reactive } from 'vue'

import { useAuthStore } from '@/store/auth'

import type { CustomTabBarItemResolved } from './types'

import { TABBAR_FALLBACK_PAGE, customTabbarList } from './config'

/** tabbarList 的 path 与 `config.ts` / `pages.json` 中 tabBar.list 一致（此处带 `/` 前缀） */
const baseTabbarList = reactive<CustomTabBarItemResolved[]>(
  customTabbarList.map((item) => ({
    ...item,
    pagePath: item.pagePath.startsWith('/') ? item.pagePath : `/${item.pagePath}`,
  })),
)

/**
 * 单条 tabbar 是否对当前权限可见
 * - 未声明 permissions / 空数组 → 所有人可见
 * - permissionsMode 默认 'any'：任一命中即可
 * - permissionsMode = 'all'：必须全部命中
 */
function isTabVisible(item: CustomTabBarItemResolved, perms: string[]) {
  if (!item.permissions || item.permissions.length === 0) {
    return true
  }
  const mode = item.permissionsMode ?? 'any'
  if (mode === 'all') {
    return item.permissions.every((p) => perms.includes(p))
  }
  return item.permissions.some((p) => perms.includes(p))
}

/** 运行时按权限过滤后的 tabbar 列表（pages.json 的 tabBar.list 仍是全集） */
const tabbarList = computed<CustomTabBarItemResolved[]>(() => {
  const authStore = useAuthStore()
  const { permissions } = storeToRefs(authStore)
  return baseTabbarList.filter((item) => isTabVisible(item, permissions.value))
})

/**
 * 当前权限下过滤后列表的第一项 path（与底部 tab 顺序一致）。
 * 仅在 Pinia 已激活后调用（与读取 `tabbarList.value` 相同前提）。
 */
export function getDefaultTabbarPagePath(): string {
  const list = tabbarList.value
  if (list.length === 0) {
    return TABBAR_FALLBACK_PAGE
  }
  return list[0].pagePath
}

export function isPageTabbar(path: string) {
  const _path = path.split('?')[0]
  return tabbarList.value.some((item) => item.pagePath === _path)
}

const TABBAR_PATH_STORAGE_KEY = 'app-tabbar-path'

/**
 * 自定义 tabbar 状态。
 * 持久化"当前 pagePath"而非数组下标，避免权限变化导致 tab 错位。
 *
 * 注意：`curIdx` 必须是 getter（懒求值）。tabbar/store.ts 经常在 Pinia
 * `setActivePinia` 之前就被 import（通过 tabbar/index.vue 链路），
 * 如果在模块顶层同步调用 `tabbarList.value` 会触发 `useAuthStore()`，
 * 抛出 `getActivePinia() was called but there was no active Pinia`。
 */
const tabbarStore = reactive({
  curPath: (uni.getStorageSync(TABBAR_PATH_STORAGE_KEY) as string) || '',

  get curIdx(): number {
    const list = tabbarList.value
    if (list.length === 0) return 0
    if (!this.curPath) return 0
    const idx = list.findIndex((item) => item.pagePath === this.curPath)
    return idx === -1 ? 0 : idx
  },

  setCurIdx(idx: number) {
    const item = tabbarList.value[idx]
    if (!item) return
    this.curPath = item.pagePath
    uni.setStorageSync(TABBAR_PATH_STORAGE_KEY, item.pagePath)
  },

  setAutoCurIdx(path: string) {
    const list = tabbarList.value
    if (list.length === 0) {
      this.setCurIdx(0)
      return
    }
    if (path === '/') {
      this.setCurIdx(0)
      return
    }
    const index = list.findIndex((item) => item.pagePath === path)
    if (index === -1) {
      const pagesPathList = getCurrentPages().map((item) =>
        item.route?.startsWith('/') ? item.route : `/${item.route}`,
      )
      const flag = list.some((item) => pagesPathList.includes(item.pagePath))
      if (!flag) {
        this.setCurIdx(0)
      }
    } else {
      this.setCurIdx(index)
    }
  },
})

export { tabbarList, tabbarStore }
