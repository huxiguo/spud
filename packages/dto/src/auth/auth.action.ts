import { DataResponse } from '../response.base'

// 登录请求
export type LoginRequest = {
  username: string
  password: string
}

// 登录响应
export type LoginResponse = DataResponse<{
  id: string
  token: string
}>
