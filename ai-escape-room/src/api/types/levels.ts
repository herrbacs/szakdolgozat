import { SpriteStyleEnum } from "../../shared/enums"

export type RatingFilter = "3" | "4" | ""
export type DifficultyFilter = "1" | "2" | "3" | "4" | "5" | ""

export type LevelListItem = {
  id: string
  title: string
  story: string
  difficulty: number
  generated_at: string
  rating: number | null
  favorite_count: number
  total_tokens: number
  total_minutes: number
  repair_count: number
  avg_completion_minutes: number | null
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
  difficulty?: DifficultyFilter
  favoritesOnly?: boolean
}

export interface EstimateTokensRequest {
  difficulty: number
}

export interface EstimateTokensResponse {
  estimated_tokens: number
  estimated_minutes: number
  current_balance: number
  sufficient: boolean
}

export interface GenerateLevelRequest {
  difficulty: number
  sprite_style: SpriteStyleEnum
  story: string
}

export interface GenerateLevelResponse {
  level: any
  tokens: {
    generation_tokens: number
    generation_minutes: number
    validation_tokens: number
    validation_minutes: number
    repair_tokens: number
    repair_minutes: number
    sprite_tokens: number
    sprite_minutes: number
    total_tokens: number
    total_minutes: number
    repair_count: number
  }
}

export interface LevelCompletionRequest {
  completion_minutes: number
}
