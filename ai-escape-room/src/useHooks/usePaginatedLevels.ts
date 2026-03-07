import { useCallback, useEffect, useState } from "react"
import { listLevels } from "../api/levels"
import type { DifficultyFilter, LevelListItem, PagedResponse, RatingFilter } from "../api/types/levels"
import { authTokenStorage } from "../store/tokenStorage"

type LevelFilters = {
  title: string
  story: string
  ratingGte: RatingFilter
  difficulty: DifficultyFilter
  favoritesOnly: boolean
}

type UsePaginatedLevelsResult = {
  levels: LevelListItem[]
  loading: boolean
  error: string | null
  page: number
  totalPages: number
  total: number
  filters: LevelFilters
  setTitleFilter: (value: string) => void
  setStoryFilter: (value: string) => void
  setRatingFilter: (value: RatingFilter) => void
  setDifficultyFilter: (value: DifficultyFilter) => void
  setFavoritesOnlyFilter: (value: boolean) => void
  setPage: (value: number) => void
  refresh: () => Promise<void>
}

const PAGE_SIZE = 10

export const usePaginatedLevels = (): UsePaginatedLevelsResult => {
  const [response, setResponse] = useState<PagedResponse<LevelListItem> | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState<number>(1)
  const [filters, setFilters] = useState<LevelFilters>({
    title: "",
    story: "",
    ratingGte: "",
    difficulty: "",
    favoritesOnly: false,
  })

  const fetchLevels = useCallback(async () => {
    const tokens = authTokenStorage.get()
    if (!tokens?.accessToken) {
      setError("Missing access token")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await listLevels({
        page,
        pageSize: PAGE_SIZE,
        title: filters.title,
        story: filters.story,
        ratingGte: filters.ratingGte,
        difficulty: filters.difficulty,
        favoritesOnly: filters.favoritesOnly,
      })
      setResponse(data)
    } catch {
      setError("Failed to load levels")
    } finally {
      setLoading(false)
    }
  }, [page, filters.title, filters.story, filters.ratingGte, filters.difficulty, filters.favoritesOnly])

  useEffect(() => {
    fetchLevels()
  }, [fetchLevels])

  const updateTitle = (value: string) => {
    setPage(1)
    setFilters((prev) => ({ ...prev, title: value }))
  }

  const updateStory = (value: string) => {
    setPage(1)
    setFilters((prev) => ({ ...prev, story: value }))
  }

  const updateRating = (value: RatingFilter) => {
    setPage(1)
    setFilters((prev) => ({ ...prev, ratingGte: value }))
  }
  const updateDifficulty = (value: DifficultyFilter) => {
    setPage(1)
    setFilters((prev) => ({ ...prev, difficulty: value }))
  }
  const updateFavoritesOnly = (value: boolean) => {
    setPage(1)
    setFilters((prev) => ({ ...prev, favoritesOnly: value }))
  }

  return {
    levels: response?.items ?? [],
    loading,
    error,
    page,
    totalPages: response?.total_pages ?? 1,
    total: response?.total ?? 0,
    filters,
    setTitleFilter: updateTitle,
    setStoryFilter: updateStory,
    setRatingFilter: updateRating,
    setDifficultyFilter: updateDifficulty,
    setFavoritesOnlyFilter: updateFavoritesOnly,
    setPage,
    refresh: fetchLevels,
  }
}
