import React from "react"

export type SelectedLevelPreview = {
  id: string
  title: string
  story: string
}

type SelectedLevelModalProps = {
  level: SelectedLevelPreview | null
  onClose: () => void
  onPlayLevel: (levelId: string) => void
}

const SelectedLevelModal: React.FC<SelectedLevelModalProps> = ({
  level,
  onClose,
  onPlayLevel,
}) => {
  if (!level) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          {level.title}
        </h2>
        <p className="text-gray-700 whitespace-pre-wrap max-h-72 overflow-auto">
          {level.story}
        </p>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200"
          >
            Close
          </button>
          <button
            onClick={() => onPlayLevel(level.id)}
            className="px-4 py-2 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Play Level
          </button>
        </div>
      </div>
    </div>
  )
}

export default SelectedLevelModal
