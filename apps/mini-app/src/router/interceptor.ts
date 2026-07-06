/**
 * 路由拦截，通常也是登录拦截
 * 白名单的配置，请看 config.ts 文件， EXCLUDE_LOGIN_PATH_LIST
 */
import { useAuthStore } from '@/store/auth'
import { getDefaultTabbarPagePath, tabbarStore } from '@/tabbar/store'
import { getLastPage, parseUrlToObj } from '@/utils/index'

import { EXCLUDE_LOGIN_PATH_LIST, LOGIN_PAGE } from './config'

function judgeIsExcludePath(path: string) {
  return EXCLUDE_LOGIN_PATH_LIST.includes(path)
}

export const navigateToInterceptor = {
  // 注意，这里的url是 '/' 开头的，如 '/pages/index/index'，跟 'pages.json' 里面的 path 不同
  invoke({ url, query }: { url: string; query?: Record<string, string> }) {
    if (url === undefined) {
      return
    }
    let { path, query: _query } = parseUrlToObj(url)

    const myQuery = { ..._query, ...query }
    // /pages/route-interceptor/index?name=feige&age=30

    // 处理相对路径
    if (!path.startsWith('/')) {
      const currentPath = getLastPage()?.route || ''
      const normalizedCurrentPath = currentPath.startsWith('/') ? currentPath : `/${currentPath}`
      const baseDir = normalizedCurrentPath.substring(0, normalizedCurrentPath.lastIndexOf('/'))
      path = `${baseDir}/${path}`
    }

    // // 处理路由不存在的情况
    // if (path !== '/' && !getAllPages().some(page => page.path === path)) {
    //   console.warn('路由不存在:', path)
    //   return false // 明确表示阻止原路由继续执行
    // }

    // // 插件页面
    // if (url.startsWith('plugin://')) {
    //   FG_LOG_ENABLE && console.log('路由拦截器 4: plugin:// 路径 ==>', url)
    //   path = url
    // }

    // 处理直接进入路由非首页时，tabbarIndex 不正确的问题
    tabbarStore.setAutoCurIdx(path)

    const tokenStore = useAuthStore()

    // 不管黑白名单，登录了就直接去吧（但是当前不能是登录页）
    if (tokenStore.token) {
      if (path !== LOGIN_PAGE) {
        return true // 明确表示允许路由继续执行
      } else {
        console.log('已经登录，但是还在登录页', myQuery.redirect)
        const url = getDefaultTabbarPagePath()
        tabbarStore.setCurIdx(0)
        uni.switchTab({ url })
        return false // 明确表示阻止原路由继续执行
      }
    }
    let fullPath = path

    if (Object.keys(myQuery).length) {
      fullPath += `?${Object.keys(myQuery)
        .map((key) => `${key}=${myQuery[key]}`)
        .join('&')}`
    }
    const redirectUrl = `${LOGIN_PAGE}?redirect=${encodeURIComponent(fullPath)}`

    // 需要登录里面的 EXCLUDE_LOGIN_PATH_LIST 表示白名单，可以直接通过
    if (judgeIsExcludePath(path)) {
      return true // 明确表示允许路由继续执行
    }
    // 否则需要重定向到登录页
    if (path === LOGIN_PAGE) {
      return true // 明确表示允许路由继续执行
    }
    uni.navigateTo({ url: redirectUrl })
    return false // 明确表示阻止原路由继续执行
  },
}

// 针对 chooseLocation 的特殊处理
export const chooseLocationInterceptor = {
  invoke(_options: any) {
    // 直接放行 chooseLocation 调用
    // LOG_ENABLE && console.log('chooseLocation 调用，直接放行:', options)
    return true
  },
}

export const routeInterceptor = {
  install() {
    uni.addInterceptor('navigateTo', navigateToInterceptor)
    uni.addInterceptor('reLaunch', navigateToInterceptor)
    uni.addInterceptor('redirectTo', navigateToInterceptor)
    uni.addInterceptor('switchTab', navigateToInterceptor)

    // 添加 chooseLocation 的拦截器，确保直接放行
    uni.addInterceptor('chooseLocation', chooseLocationInterceptor)
  },
}
