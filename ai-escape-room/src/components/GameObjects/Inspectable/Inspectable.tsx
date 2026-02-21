import React, { useCallback, useContext, useEffect, useState } from "react"
import { InspectableObject } from "../../../shared/types/gameObjectTypes"
import { AppSettingsContextType } from "../../../shared/types/frameworkTypes"
import { AppSettingsContext } from "../../../context/AppSettingsContext"
import { FederatedPointerEvent, Graphics, GraphicsContext, PointData } from "pixi.js"
import { setPositionOn } from "../../../shared/positionCalculator"
import { SetAppSettingsActionEnum } from "../../../shared/enums"
import { CursorActions } from "../../../shared/types/appTypes"
import { useSprite } from "../../../useHooks/useSprites"

type InspectableComponentType = {
	inspectable: InspectableObject,
}

const Inspectable = ({ inspectable }: InspectableComponentType) => {
  const { 
    appSettings: { screenSettings, gameInformation: { cursorActions, levelId }},
    setAppSettings
  }: AppSettingsContextType = useContext(AppSettingsContext)
	const [spriteCoordinate, setSpriteCoordinate] = useState<PointData>({} as PointData)
  const { sprite, spriteLoaded } = useSprite(levelId, inspectable.id)

  const openCursorActions = (event: FederatedPointerEvent) => {
    const position: CursorActions = {
      position: cursorActions.position === null ? event.screen : null,
      examine: { ...inspectable.inspectionData, id: inspectable.id },
      use: null,
      take: null,
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
			area: inspectable.position,
			screenSettings,
		}))
  }, [])

  return spriteLoaded && (
    <pixiSprite
      anchor={0.5}
      texture={sprite}
      eventMode="static"
      cursor="pointer"
      onRightClick={openCursorActions}
      scale={.07}
      x={spriteCoordinate.x}
      y={spriteCoordinate.y}
    />
  )
}

export default Inspectable