export const LOGIN_PAGE = '/pages/auth/index'
export const SPLASH_SCREEN_PAGE = '/pages/splash-screen/index'
/** 未登录也可浏览（如登录页勾选协议跳转） */
export const USER_AGREEMENT_PAGE = '/pages/me/user-agreement'
export const PRIVACY_POLICY_PAGE = '/pages/me/privacy-policy'

// 白名单
export const EXCLUDE_LOGIN_PATH_LIST = [
  LOGIN_PAGE,
  SPLASH_SCREEN_PAGE,
  USER_AGREEMENT_PAGE,
  PRIVACY_POLICY_PAGE,
]
