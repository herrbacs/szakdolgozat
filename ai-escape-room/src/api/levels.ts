import { API_BASE_URL } from "../shared/urls"
import { get, post, del } from "./api"
import type { EstimateTokensRequest, EstimateTokensResponse, GenerateLevelRequest, GenerateLevelResponse, LevelListItem, ListLevelsQuery, PagedResponse } from "./types/levels"

export async function listLevels(query: ListLevelsQuery): Promise<PagedResponse<LevelListItem>> {
  const params = new URLSearchParams()
  params.set("page", String(query.page))
  params.set("page_size", String(query.pageSize))

  if (query.title?.trim()) {
    params.set("title", query.title.trim())
  }
  if (query.story?.trim()) {
    params.set("story", query.story.trim())
  }
  if (query.ratingGte) {
    params.set("rating_gte", query.ratingGte)
  }
  if (query.difficulty) {
    params.set("difficulty", query.difficulty)
  }
  if (query.favoritesOnly) {
    params.set("favorites_only", "true")
  }

  const response = await get(`${API_BASE_URL}/levels?${params.toString()}`)

  if (!response.ok) {
    throw new Error("Failed to fetch levels")
  }

  return (await response.json()) as PagedResponse<LevelListItem>
}

export async function rateLevel(levelId: string, rate: number): Promise<void> {
  const response = await post(`${API_BASE_URL}/levels/rate/${levelId}`, { rate })

  if (!response.ok) {
    throw new Error("Failed to rate level")
  }
}

export async function addLevelToFavorites(levelId: string): Promise<void> {
  const response = await post(`${API_BASE_URL}/levels/favorite/${levelId}`, {})

  if (!response.ok) {
    throw new Error("Failed to add level to favorites")
  }
}

export async function removeLevelFromFavorites(levelId: string): Promise<void> {
  const response = await del(`${API_BASE_URL}/levels/favorite/${levelId}`)

  if (!response.ok) {
    throw new Error("Failed to remove level from favorites")
  }
}

export async function getUserLevelRating(levelId: string): Promise<number | null> {
  const response = await get(`${API_BASE_URL}/levels/rating/${levelId}`)

  if (!response.ok) {
    throw new Error("Failed to fetch level rating")
  }

  const data = (await response.json()) as { rating: number | null }
  return data.rating
}

export async function isLevelFavorite(levelId: string): Promise<boolean> {
  const response = await get(`${API_BASE_URL}/levels/is-favorite/${levelId}`)

  if (!response.ok) {
    throw new Error("Failed to fetch favorite status")
  }

  const data = (await response.json()) as { is_favorite: boolean }
  return data.is_favorite
}

export async function estimateTokens(request: EstimateTokensRequest): Promise<EstimateTokensResponse> {
  const response = await post(`${API_BASE_URL}/levels/estimate-tokens`, request)

  if (!response.ok) {
    throw new Error("Failed to estimate tokens")
  }

  return await response.json()
}

export async function generateLevel(request: GenerateLevelRequest): Promise<GenerateLevelResponse> {
  const response = await post(`${API_BASE_URL}/levels/generate`, request)

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.detail?.message || "Failed to generate level")
  }

  return await response.json()
}
