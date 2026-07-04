export type MessageResponse = {
  success: boolean
  message: string
}

export type DataResponse<T> = MessageResponse & { data: T | null }

export type ExistDataResponse<T> = MessageResponse & { data: T }

export type ArrayResponse<T> = MessageResponse & {
  data: T[]
}

export type PageResponse<T> = MessageResponse & {
  data: {
    list: T[]
    total: number
  }
}
