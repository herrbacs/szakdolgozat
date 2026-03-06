import { API_BASE_URL } from "../shared/urls"
import { get, post, del } from "./api"
import type { LevelListItem, ListLevelsQuery, PagedResponse } from "./types/levels"

export async function listLevels(
  query: ListLevelsQuery,
  token: string
): Promise<PagedResponse<LevelListItem>> {
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

  const response = await get(`${API_BASE_URL}/levels?${params.toString()}`)

  if (!response.ok) {
    throw new Error("Failed to fetch levels")
  }

  return (await response.json()) as PagedResponse<LevelListItem>
}

export async function rateLevel(levelId: string, rate: number, token: string): Promise<void> {
  const response = await post(`${API_BASE_URL}/levels/rate/${levelId}`, { rate })

  if (!response.ok) {
    throw new Error("Failed to rate level")
  }
}

export async function addLevelToFavorites(levelId: string, token: string): Promise<void> {
  const response = await post(`${API_BASE_URL}/levels/favorite/${levelId}`, {})

  if (!response.ok) {
    throw new Error("Failed to add level to favorites")
  }
}

export async function removeLevelFromFavorites(levelId: string, token: string): Promise<void> {
  const response = await del(`${API_BASE_URL}/levels/favorite/${levelId}`)

  if (!response.ok) {
    throw new Error("Failed to remove level from favorites")
  }
}

export async function getUserLevelRating(levelId: string, token: string): Promise<number | null> {
  const response = await get(`${API_BASE_URL}/levels/rating/${levelId}`)

  if (!response.ok) {
    throw new Error("Failed to fetch level rating")
  }

  const data = (await response.json()) as { rating: number | null }
  return data.rating
}

export async function isLevelFavorite(levelId: string, token: string): Promise<boolean> {
  const response = await get(`${API_BASE_URL}/levels/is-favorite/${levelId}`)

  if (!response.ok) {
    throw new Error("Failed to fetch favorite status")
  }

  const data = (await response.json()) as { is_favorite: boolean }
  return data.is_favorite
}
