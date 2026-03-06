import React, { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import type { LevelListItem, RatingFilter } from "../../api/types/levels"
import { usePaginatedLevels } from "../../useHooks/usePaginatedLevels"

const Levels: React.FC = () => {
  const navigate = useNavigate()
  const {
    levels,
    loading,
    error,
    page,
    totalPages,
    total,
    filters,
    setTitleFilter,
    setStoryFilter,
    setRatingFilter,
    setPage,
  } = usePaginatedLevels()

  const [selectedLevel, setSelectedLevel] = useState<LevelListItem | null>(null)

  const canGoPrev = page > 1
  const canGoNext = page < totalPages

  const ratingLabel = useMemo(() => {
    if (filters.ratingGte === "4") return ">= 4"
    if (filters.ratingGte === "3") return ">= 3"
    return "All"
  }, [filters.ratingGte])

  const formatGeneratedAt = (value: string) =>
    new Date(value).toLocaleString("hu-HU", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 px-4 py-10">
      <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl p-6 md:p-8">
        <div className="flex items-center justify-between gap-3 mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">Levels</h1>
          <button
            onClick={() => navigate("/menu")}
            className="px-4 py-2 rounded-lg font-semibold text-white transition bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]"
          >
            Back to Menu
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-5">
          <input
            type="text"
            value={filters.title}
            onChange={(e) => setTitleFilter(e.target.value)}
            placeholder="Search by title"
            className="px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            value={filters.story}
            onChange={(e) => setStoryFilter(e.target.value)}
            placeholder="Search in story"
            className="px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={filters.ratingGte}
            onChange={(e) => setRatingFilter(e.target.value as RatingFilter)}
            className="px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Rating: All</option>
            <option value="4">{ 'Rating >= 4' }</option>
            <option value="3">{ 'Rating >= 3' }</option>
          </select>
          <div className="px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-600">
            Found: {total} | Rating: {ratingLabel}
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold">
                  Title
                </th>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold">
                  Generated at
                </th>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold">
                  Average rating
                </th>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold">
                  Favorites
                </th>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold">
                  Total Tokens
                </th>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold">
                  Repairs
                </th>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                    Loading levels...
                  </td>
                </tr>
              ) : levels.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                    No levels found
                  </td>
                </tr>
              ) : (
                levels.map((level) => (
                  <tr key={level.id} className="border-t border-gray-100">
                    <td className="px-4 py-3 text-gray-800">{level.title}</td>
                    <td className="px-4 py-3 text-gray-700">
                      {formatGeneratedAt(level.generated_at)}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {level.rating ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {level.favorite_count}
                    </td>
                    <td className="px-4 py-3 text-gray-700 font-medium">
                      {level.total_tokens}
                    </td>
                    <td className="px-4 py-3 text-gray-700 font-medium">
                      {level.repair_count}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedLevel(level)}
                        className="px-3 py-1.5 rounded-md font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        View Story
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between mt-5">
          <div className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => canGoPrev && setPage(page - 1)}
              disabled={!canGoPrev}
              className={`px-4 py-2 rounded-lg font-semibold text-white transition ${
                canGoPrev
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : "bg-indigo-300 cursor-not-allowed"
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => canGoNext && setPage(page + 1)}
              disabled={!canGoNext}
              className={`px-4 py-2 rounded-lg font-semibold text-white transition ${
                canGoNext
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : "bg-indigo-300 cursor-not-allowed"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {selectedLevel && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              {selectedLevel.title}
            </h2>
            <p className="text-gray-700 whitespace-pre-wrap max-h-72 overflow-auto">
              {selectedLevel.story}
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setSelectedLevel(null)}
                className="px-4 py-2 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200"
              >
                Close
              </button>
              <button
                onClick={() => navigate(`/game?levelId=${selectedLevel.id}`)}
                className="px-4 py-2 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Play Level
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Levels
