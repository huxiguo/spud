import type { AuthContract } from '@spud/dto'

import { http } from '../http/alova'

export const loginAPI = (data: AuthContract.LoginRequest) => {
  return http.Post<AuthContract.LoginResponse>('/auth/login', data)
}
