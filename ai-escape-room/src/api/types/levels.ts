export type RatingFilter = "3" | "4" | ""

export type LevelListItem = {
  id: string
  title: string
  story: string
  generated_at: string
  rating: number | null
}

export type PagedResponse<T> = {
  items: T[]
  page: number
  page_size: number
  total: number
  total_pages: number
}

export type ListLevelsQuery = {
  page: number
  pageSize: number
  title?: string
  story?: string
  ratingGte?: RatingFilter
}
