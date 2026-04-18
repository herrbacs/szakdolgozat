import React, { useContext, useState } from 'react'
import { AppSettingsContextType } from '../../../shared/types/frameworkTypes'
import { AppSettingsContext } from '../../../context/AppSettingsContext'
import { spriteUrl } from '../../../shared/urls'
import { PickableObject } from '../../../shared/types/gameObjectTypes'
import { SetAppSettingsActionEnum } from '../../../shared/enums'
import { CursorActions } from '../../../shared/types/appTypes'

const Inventory = () => {
  const {
    appSettings: {
      screenSettings: { dimension: { width } },
      gameInformation: { inventory, showInventory, selectedItem, cursorActions, levelId },
    },
    setAppSettings
  }: AppSettingsContextType = useContext(AppSettingsContext)

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const selectItem = (item: PickableObject) =>
    selectedItem?.id == item.id
      ? setAppSettings({ action: SetAppSettingsActionEnum.UNSELECT_ITEM })
      : setAppSettings({ action: SetAppSettingsActionEnum.SELECT_ITEM, payload: item })

  const openCursorActions = (event: React.MouseEvent<HTMLDivElement>, item: PickableObject) => {
    const position = cursorActions.position === null
      ? { x: event.clientX, y: event.clientY }
      : null

    const payload: CursorActions = {
      position,
      examine: { ...item.inspectionData, id: item.id },
      use: { action: () => selectItem(item) },
      take: null,
      search: null,
    }

    setAppSettings({ action: SetAppSettingsActionEnum.SET_CURSOR_ACTIONS, payload })
  }

  const slots = []
  for (let i = 0; i <= 10; i++) {
    const item = inventory[i]
    const isSelected = item ? selectedItem?.id === item.id : false
    const isHovered = hoveredIndex === i

    if (!item) {
      slots.push(
        <div
          key={i}
          className="relative flex h-19 w-19 items-center justify-center overflow-hidden rounded-2xl border border-slate-200/80 bg-white/65 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"
        >
          <div className="absolute inset-[0.45rem] rounded-xl border border-dashed border-slate-300/80" />
          <div className="h-7 w-7 rounded-full bg-slate-200/60 blur-[1px]" />
        </div>
      )
      continue
    }

    const slotClassName = isSelected
      ? isHovered
        ? 'border-amber-300 bg-gradient-to-br from-amber-200 via-amber-100 to-yellow-50 shadow-[0_12px_24px_rgba(251,191,36,0.25)]'
        : 'border-amber-300 bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-50 shadow-[0_10px_20px_rgba(251,191,36,0.18)]'
      : isHovered
        ? 'border-sky-200 bg-white/95 shadow-[0_12px_22px_rgba(148,163,184,0.22)]'
        : 'border-slate-200/80 bg-white/85 shadow-[0_8px_18px_rgba(148,163,184,0.18)]'

    const imageClassName = isSelected
      ? 'drop-shadow-[0_8px_14px_rgba(120,53,15,0.28)]'
      : 'drop-shadow-[0_8px_12px_rgba(71,85,105,0.28)]'

    slots.push(
      <div
        key={i}
        className={`group relative flex h-19 w-19 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border transition-all duration-200 ${slotClassName}`}
        onContextMenu={(e) => openCursorActions(e, item)}
        onMouseEnter={() => setHoveredIndex(i)}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <div className="absolute inset-[0.3rem] rounded-2xl border border-white/70" />
        <div className={`absolute inset-0 bg-linear-to-b ${isSelected ? 'from-white/60 via-white/20 to-transparent' : 'from-white/45 via-white/10 to-transparent'}`} />
        <img
          src={spriteUrl(levelId, item.id)}
          className={`relative z-10 h-auto w-12 transition-transform duration-200 group-hover:scale-105 ${imageClassName}`}
        />
        {isSelected && (
          <div className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.85)]" />
        )}
      </div>
    )
  }

  return (
    <div
      style={{ width: `${width}px`, transform: showInventory ? 'translateY(0)' : 'translateY(calc(100% + 1rem))' }}
      className="absolute bottom-0 left-0 flex items-stretch gap-3 px-4 pb-4 pt-2 transition-transform duration-700 ease-out"
    >
      <div className="flex items-center">
        <div className="flex h-[5.2rem] w-8 items-center justify-center rounded-l-[1.75rem] border border-white/60 bg-white/65 shadow-[0_8px_20px_rgba(148,163,184,0.18)] backdrop-blur-sm">
          <svg
            className="h-14 w-5 text-slate-500"
            viewBox="3.433 4.327 101.769 99.833"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
          >
            <path d="M 104.539 4.769 L 3.433 48.993 L 105.201 104.16 C 74.502 67.268 73.668 34.506 105.202 4.327 L 104.539 4.769 Z" />
          </svg>
        </div>
      </div>

      <div className="flex flex-1 items-center rounded-4xl border border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(241,245,249,0.88)_100%)] px-4 py-3 shadow-[0_18px_36px_rgba(148,163,184,0.22)] backdrop-blur-md">
        <div className="flex w-full items-center justify-between gap-2 overflow-hidden">
          {slots}
        </div>
      </div>

      <div className="flex items-center">
        <div className="flex h-[5.2rem] w-8 items-center justify-center rounded-r-[1.75rem] border border-white/60 bg-white/65 shadow-[0_8px_20px_rgba(148,163,184,0.18)] backdrop-blur-sm">
          <svg
            className="h-14 w-5 rotate-180 text-slate-500"
            viewBox="3.433 4.327 101.769 99.833"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
          >
            <path d="M 104.539 4.769 L 3.433 48.993 L 105.201 104.16 C 74.502 67.268 73.668 34.506 105.202 4.327 L 104.539 4.769 Z" />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default Inventory
