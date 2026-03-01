import { API_BASE_URL } from "../shared/urls"
import { get } from "./api"
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
  if (query.ratingGte && query.ratingGte !== "") {
    params.set("rating_gte", query.ratingGte)
  }

  const response = await get(`${API_BASE_URL}/levels?${params.toString()}`, token)

  if (!response.ok) {
    throw new Error("Failed to fetch levels")
  }

  return (await response.json()) as PagedResponse<LevelListItem>
}
