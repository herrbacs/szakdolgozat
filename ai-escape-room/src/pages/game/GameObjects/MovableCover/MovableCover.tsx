import React, { useContext, useEffect, useState } from "react"
import { FederatedPointerEvent, PointData } from "pixi.js"
import Pickable from "../Pickable"
import Inspectable from "../Inspectable/Inspectable"
import Container from "../Container/Container"
import { ContainerObject, InspectableObject, MovableCoverObject, PickableObject } from "../../../../shared/types/gameObjectTypes"
import { AppSettingsContextType } from "../../../../shared/types/frameworkTypes"
import { AppSettingsContext } from "../../../../context/AppSettingsContext"
import { useSprite } from "../../../../useHooks/useSprites"
import { CursorActions } from "../../../../shared/types/appTypes"
import { GameObjectTypeEnum, SetAppSettingsActionEnum } from "../../../../shared/enums"
import { setPositionOn } from "../../../../shared/positionCalculator"
import { getScaleByObjectSize } from "../../../../shared/gameObjectScale"
import { getAnchorByObjectPosition } from "../../../../shared/gameObjectSpriteAnchor"


type MovableCoverComponentType = {
	movableCover: MovableCoverObject,
}

const MovableCover = ({ movableCover }: MovableCoverComponentType) => {
	const {
    appSettings: {
      screenSettings,
      gameInformation: { cursorActions, levelId }
    },
  setAppSettings
}: AppSettingsContextType = useContext(AppSettingsContext)
	const [spriteCoordinate, setSpriteCoordinate] = useState<PointData>({} as PointData)
  const { sprite, spriteLoaded } = useSprite(levelId, movableCover.id)

  const openCursorActions = (event: FederatedPointerEvent) => {
    const position: CursorActions = {
      position: cursorActions.position === null ? event.screen : null,
      examine: { ...movableCover.inspectionData, id: movableCover.id },
      use: {
        action: () => setAppSettings({ action: SetAppSettingsActionEnum.REMOVE_COVER, payload: movableCover })
      },
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
			area: movableCover.position,
			screenSettings,
		}))
  }, [])

  if (!movableCover.used && spriteLoaded) {
    return (
      <pixiSprite
        anchor={getAnchorByObjectPosition(movableCover.position)}
        texture={sprite}
        eventMode="static"
        cursor="pointer"
        onClick={openCursorActions}
        scale={getScaleByObjectSize(movableCover.size)}
        x={spriteCoordinate.x}
        y={spriteCoordinate.y}
      />
    )
  }

  switch(movableCover.content.type) {
    case GameObjectTypeEnum.PICKABLE:
      return <Pickable key={movableCover.content.object.id} pickable={movableCover.content.object as PickableObject}/>
    case GameObjectTypeEnum.INSPECTABLE:
      return <Inspectable key={movableCover.content.object.id} inspectable={movableCover.content.object as InspectableObject}/>
    case GameObjectTypeEnum.CONTAINER:
      return <Container key={movableCover.id} container={movableCover.content.object as ContainerObject}/>
  }
  
}

export default MovableCover
