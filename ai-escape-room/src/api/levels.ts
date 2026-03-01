import { API_BASE_URL } from "../shared/urls"
import { get, post } from "./api"
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

  const response = await get(`${API_BASE_URL}/levels?${params.toString()}`, token)

  if (!response.ok) {
    throw new Error("Failed to fetch levels")
  }

  return (await response.json()) as PagedResponse<LevelListItem>
}

export async function rateLevel(levelId: string, rate: number, token: string): Promise<void> {
  const response = await post(`${API_BASE_URL}/levels/rate/${levelId}`, { rate }, token)

  if (!response.ok) {
    throw new Error("Failed to rate level")
  }
}

export async function addLevelToFavorites(levelId: string, token: string): Promise<void> {
  const response = await post(`${API_BASE_URL}/levels/favorite/${levelId}`, {}, token)

  if (!response.ok) {
    throw new Error("Failed to add level to favorites")
  }
}
