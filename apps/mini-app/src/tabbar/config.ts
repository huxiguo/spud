import type { TabBar } from '@uni-helper/vite-plugin-uni-pages'

import type { CustomTabBarItem } from './types'

/** 过滤后的 tab 列表为空时的兜底页（「我的」，与 customTabbarList 中 me 项一致） */
export const TABBAR_FALLBACK_PAGE = '/pages/me/index'

/**
 * 微信小程序自定义 tabbar 配置（需在 `pages.config.ts` 中通过 `tabBar` 注入）
 * UnoCSS 图标需 safelist 或在某处引用类名，否则可能被打包剔除
 */
export const customTabbarList: CustomTabBarItem[] = [
  {
    text: '工作台',
    pagePath: 'pages/index/index',
    icon: 'i-carbon-home',
    permissions: [],
  },
  {
    pagePath: 'pages/me/index',
    text: '我的',
    icon: 'i-carbon-user',
  },
]

const tabbarListForPagesJson = customTabbarList.map((item) => ({
  text: item.text,
  pagePath: item.pagePath,
}))

export const tabBar: TabBar = {
  custom: true,
  color: '#999999',
  selectedColor: '#018d71',
  backgroundColor: '#F8F8F8',
  borderStyle: 'black',
  height: '50px',
  fontSize: '10px',
  iconWidth: '24px',
  spacing: '3px',
  list: tabbarListForPagesJson as unknown as TabBar['list'],
}
