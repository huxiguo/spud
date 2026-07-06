import type { RemoveLeadingSlashFromUnion } from '@/typings'

/** badge：数字或小红点（样式可在 `TabbarItem.vue` 调整） */
export type CustomTabBarItemBadge = number | 'dot'

/** 微信小程序自定义 tabbar 单项（图标为 UnoCSS 类名） */
export interface CustomTabBarItem {
  text: string
  pagePath: RemoveLeadingSlashFromUnion<_LocationUrl>
  /** UnoCSS 图标类名，如 i-carbon-home */
  icon: string
  badge?: CustomTabBarItemBadge
  /** 是否是中间的鼓包 tabbar 项 */
  isBulge?: boolean
  /** 不写则所有用户可见；写了则仅匹配角色的用户可见 */
  roles?: string[]
  /**
   * 不写或为空数组则所有人可见；写了则按 `permissionsMode` 与 authStore.permissions 求交。
   * 权限值与 packages/logic/src/permission.ts 的模块 id（无点号）对齐。
   */
  permissions?: string[]
  /** 多个权限之间的关系，默认 'any'（任一即可）；'all' 表示需要全部命中 */
  permissionsMode?: 'any' | 'all'
}

/** store 内将 path 规范为 `/` 开头，与路由 path 一致 */
export type CustomTabBarItemResolved = Omit<CustomTabBarItem, 'pagePath'> & {
  pagePath: string
}
