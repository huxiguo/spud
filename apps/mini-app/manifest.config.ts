// manifest.config.ts
import { defineManifestConfig } from '@uni-helper/vite-plugin-uni-manifest'
import path from 'node:path'
import process from 'node:process'
import { loadEnv } from 'vite'

// 手动解析命令行参数获取 mode
function getMode() {
  const args = process.argv.slice(2)
  const modeFlagIndex = args.findIndex((arg) => arg === '--mode')
  return modeFlagIndex !== -1
    ? args[modeFlagIndex + 1]
    : args[0] === 'build'
      ? 'production'
      : 'development' // 默认 development
}
// 获取环境变量的范例
const env = loadEnv(getMode(), path.resolve(process.cwd(), 'env'))
const { VITE_APP_TITLE, VITE_UNI_APPID, VITE_WX_APPID } = env

export default defineManifestConfig({
  name: VITE_APP_TITLE,
  appid: VITE_UNI_APPID,
  description: '',
  versionName: '1.0.0',
  versionCode: '100',
  transformPx: false,
  locale: 'zh-Hans', // 'zh-Hans'
  h5: {},
  /* 5+App特有相关 */
  'app-plus': {},
  /* 快应用特有相关 */
  quickapp: {},
  /* 小程序特有相关 */
  'mp-weixin': {
    appid: VITE_WX_APPID,
    setting: {
      urlCheck: false,
      // 是否启用 ES6 转 ES5
      es6: true,
      minified: true,
    },
    permission: {
      'scope.userLocation': { desc: '使用你的位置权限' },
    },
    requiredPrivateInfos: ['getLocation', 'chooseLocation'],
    optimization: {
      subPackages: true,
    },
    // 是否合并组件虚拟节点外层属性，uni-app 3.5.1+ 开始支持。目前仅支持 style、class 属性。
    // 默认不开启（undefined），这里设置为开启。
    mergeVirtualHostAttributes: true,
    // styleIsolation: 'shared',
    usingComponents: true,
    // __usePrivacyCheck__: true,
  },
  'mp-alipay': {},
  'mp-baidu': {
    usingComponents: true,
  },
  'mp-toutiao': {
    usingComponents: true,
  },
  uniStatistics: {
    enable: false,
  },
  vueVersion: '3',
})
