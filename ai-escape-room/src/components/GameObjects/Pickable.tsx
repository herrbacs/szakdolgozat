import React, { useCallback, useContext, useEffect, useState } from "react"
import { AppSettingsContextType } from "../../shared/types/frameworkTypes"
import { PickableObject } from "../../shared/types/gameObjectTypes"
import { SetAppSettingsActionEnum } from "../../shared/enums"
import { setPositionOn } from "../../shared/positionCalculator"
import { AppSettingsContext } from "../../context/AppSettingsContext"
import { FederatedPointerEvent, Graphics, GraphicsContext, PointData, Texture } from "pixi.js"
import { CursorActions } from "../../shared/types/appTypes"
import { useSprite } from "../../useHooks/useSprites"

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
    setAppSettings({ action: SetAppSettingsActionEnum.PICK_UP_ITEM, payload: pickable });
  }, [])

  const openCursorActions = (event: FederatedPointerEvent) => {
    const position: CursorActions = {
      position: cursorActions.position === null ? event.screen : null,
      examine: pickable.inspectionData,
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
  }, [])

  return (spriteLoaded && !pickable.taken)
    ? <pixiSprite
      anchor={0.5}
      texture={sprite}
      eventMode="static"
      cursor="pointer"
      onRightClick={openCursorActions}
      scale={.07}
      x={spriteCoordinate.x}
      y={spriteCoordinate.y}
    />
    : null
}

export default Pickable