import React, { useCallback, useContext, useEffect, useState } from "react"
import { FederatedPointerEvent, PointData } from "pixi.js"
import { PickableObject } from "../../../shared/types/gameObjectTypes"
import { AppSettingsContextType } from "../../../shared/types/frameworkTypes"
import { AppSettingsContext } from "../../../context/AppSettingsContext"
import { useSprite } from "../../../useHooks/useSprites"
import { SetAppSettingsActionEnum } from "../../../shared/enums"
import { CursorActions } from "../../../shared/types/appTypes"
import { setPositionOn } from "../../../shared/positionCalculator"
import { getResponsiveScaleByObjectSize } from "../../../shared/gameObjectScale"
import { getAnchorByObjectPosition } from "../../../shared/gameObjectSpriteAnchor"

type PickableComponentTypeProperties = {
  pickable: PickableObject,
}

const Pickable = ({ pickable }: PickableComponentTypeProperties) => {
  const { appSettings: {
    screenSettings,
    gameInformation: { cursorActions, levelId }
  },
  setAppSettings
  }: AppSettingsContextType = useContext(AppSettingsContext)
  const [spriteCoordinate, setSpriteCoordinate] = useState<PointData>({ x: 0, y: 0 })
  const { sprite, spriteLoaded } = useSprite(levelId, pickable.id)

  const handlePickUp = useCallback(() => {
    setAppSettings({ action: SetAppSettingsActionEnum.PICK_UP_ITEM, payload: pickable })
  }, [])

  const openCursorActions = (event: FederatedPointerEvent) => {
    const position: CursorActions = {
      position: cursorActions.position === null ? event.screen : null,
      examine: { ...pickable.inspectionData, id: pickable.id },
      use: null,
      take: { action: handlePickUp },
      search: null,
    }

    setAppSettings({
      action: SetAppSettingsActionEnum.SET_CURSOR_ACTIONS,
      payload: position
    })
  }

  useEffect(() => {
    setSpriteCoordinate(
      setPositionOn({
        area: pickable.position,
        screenSettings,
      })
    )
  }, [pickable.position, screenSettings])

  return (spriteLoaded && !pickable.taken)
    ? <pixiSprite
      anchor={getAnchorByObjectPosition(pickable.position)}
      texture={sprite}
      eventMode="static"
      cursor="pointer"
      onClick={openCursorActions}
      scale={getResponsiveScaleByObjectSize(pickable.size, screenSettings.dimension)}
      x={spriteCoordinate.x}
      y={spriteCoordinate.y}
    />
    : null
}

export default Pickable
