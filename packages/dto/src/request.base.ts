export type OnlyIdRequest = {
  id: string
}

export type OnlyKeywordRequest = {
  keyword: string | null
}

export type OnlyIdsRequest = {
  ids: string[]
}

export type PageRequest = {
  pageNumber: number
  pageSize: number
}

export type QueryTimeRequest = {
  queryTimeType: string | null
  queryTimeRange: number[] | null
}
