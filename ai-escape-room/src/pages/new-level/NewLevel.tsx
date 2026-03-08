import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { estimateTokens, generateLevel } from "../../api/levels"
import { SpriteStyleEnum } from "../../shared/enums"
import { EstimateTokensRequest, EstimateTokensResponse, GenerateLevelRequest } from "../../api/types/levels"
import SelectedLevelModal, { SelectedLevelPreview } from "../levels/components/SelectedLevelModal"

const NewLevel: React.FC = () => {
  const navigate = useNavigate()
  const [generateLevelRequest, setGenerateLevelRequest] = useState<GenerateLevelRequest>({
    difficulty: 3,
    sprite_style: SpriteStyleEnum.CARTOON,
    story: ""
  })

  const [tokenUsageData, setTokenUsageData] = useState<EstimateTokensResponse>({
    estimated_tokens: 0,
    estimated_minutes: 0,
    current_balance: 0,
    sufficient: false
  })

  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [selectedLevel, setSelectedLevel] = useState<SelectedLevelPreview | null>(null)

  const fetchTokenEstimate = async () => {
    try {
      const request: EstimateTokensRequest = { difficulty: generateLevelRequest.difficulty }
      const response = await estimateTokens(request)
      setTokenUsageData(response)
    } catch (err) {
      console.error("Failed to estimate tokens:", err)
    }
  }

  useEffect(() => {
    fetchTokenEstimate()
  }, [generateLevelRequest.difficulty])

  const handleGenerate = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await generateLevel(generateLevelRequest)
      setSelectedLevel({
        id: response.level.id,
        title: response.level.title,
        story: response.level.story,
      })
    } catch (err: any) {
      setError(err.message || "Failed to generate level")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          New Level
        </h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Difficulty (1-5)
            </label>
            <select
              value={generateLevelRequest.difficulty}
              onChange={(e) => setGenerateLevelRequest({ ...generateLevelRequest, difficulty: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value={1}>1 - Very Easy</option>
              <option value={2}>2 - Easy</option>
              <option value={3}>3 - Medium</option>
              <option value={4}>4 - Hard</option>
              <option value={5}>5 - Very Hard</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sprite Style
            </label>
            <select
              value={generateLevelRequest.sprite_style}
              onChange={(e) => setGenerateLevelRequest({ ...generateLevelRequest, sprite_style: e.target.value as SpriteStyleEnum })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value={SpriteStyleEnum.CARTOON}>{SpriteStyleEnum.CARTOON}</option>
              <option value={SpriteStyleEnum.REALISTIC}>{SpriteStyleEnum.REALISTIC}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Story (Optional)
            </label>
            <textarea
              value={generateLevelRequest.story}
              onChange={(e) => setGenerateLevelRequest({ ...generateLevelRequest, story: e.target.value })}
              placeholder="Enter a custom story for the level..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">
              <div>Estimated tokens: <span className="font-semibold">{tokenUsageData.estimated_tokens}</span></div>
              <div>Estimated time: <span className="font-semibold">{tokenUsageData.estimated_minutes.toFixed(2)} min</span></div>
              <div>Your balance: <span className="font-semibold">{tokenUsageData.current_balance}</span></div>
              <div className={`font-semibold ${tokenUsageData.sufficient ? 'text-green-600' : 'text-red-600'}`}>
                {tokenUsageData.sufficient ? '✓ Sufficient tokens' : '✗ Insufficient tokens'}
              </div>
            </div>
            {!tokenUsageData.sufficient && (
              <button
                onClick={() => navigate("/profile")}
                className="mt-2 w-full py-2 px-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
              >
                Buy Tokens
              </button>
            )}
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <button
              onClick={handleGenerate}
              disabled={loading || !tokenUsageData.sufficient}
              className="w-full py-2.5 rounded-lg font-semibold text-white transition bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 active:scale-[0.98]"
            >
              {loading ? "Generating..." : "Generate Level"}
            </button>

            <button
              onClick={() => navigate("/menu")}
              className="w-full py-2.5 rounded-lg font-semibold text-gray-700 transition bg-gray-200 hover:bg-gray-300 active:scale-[0.98]"
            >
              Back to Menu
            </button>
          </div>
        </div>
      </div>
      <SelectedLevelModal
        level={selectedLevel}
        onClose={() => setSelectedLevel(null)}
        onPlayLevel={(levelId) => navigate(`/game?levelId=${levelId}`)}
      />
    </div>
  )
}

export default NewLevel
