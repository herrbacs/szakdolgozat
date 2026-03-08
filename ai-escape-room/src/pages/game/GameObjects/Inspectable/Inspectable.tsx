import React, { useContext, useEffect, useState } from "react"
import { FederatedPointerEvent, PointData } from "pixi.js"
import { InspectableObject } from "../../../../shared/types/gameObjectTypes"
import { AppSettingsContextType } from "../../../../shared/types/frameworkTypes"
import { AppSettingsContext } from "../../../../context/AppSettingsContext"
import { useSprite } from "../../../../useHooks/useSprites"
import { CursorActions } from "../../../../shared/types/appTypes"
import { SetAppSettingsActionEnum } from "../../../../shared/enums"
import { setPositionOn } from "../../../../shared/positionCalculator"
import { getScaleByObjectSize } from "../../../../shared/gameObjectScale"
import { getAnchorByObjectPosition } from "../../../../shared/gameObjectSpriteAnchor"

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
      anchor={getAnchorByObjectPosition(inspectable.position)}
      texture={sprite}
      eventMode="static"
      cursor="pointer"
      onClick={openCursorActions}
      scale={getScaleByObjectSize(inspectable.size)}
      x={spriteCoordinate.x}
      y={spriteCoordinate.y}
    />
  )
}

export default Inspectable
