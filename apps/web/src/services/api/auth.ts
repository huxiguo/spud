import type { AuthContract } from '@spud/dto'

import { alovaInstance } from '../http/alova'

// 登录
export const login = (data: AuthContract.LoginRequest) => {
  return alovaInstance.Post<AuthContract.LoginResponse>('/auth/login', data)
}
