import React, { useCallback, useContext, useEffect, useState } from "react"
import { ContainerObject, InspectableObject, MovableCoverObject, PickableObject } from "../../../shared/types/gameObjectTypes"
import { AppSettingsContextType } from "../../../shared/types/frameworkTypes"
import { AppSettingsContext } from "../../../context/AppSettingsContext"
import { FederatedPointerEvent, Graphics, GraphicsContext, PointData } from "pixi.js"
import { setPositionOn } from "../../../shared/positionCalculator"
import { GameObjectTypeEnum, SetAppSettingsActionEnum } from "../../../shared/enums"
import Pickable from "../Pickable"
import Inspectable from "../Inspectable/Inspectable"
import Container from "../Container/Container"
import { CursorActions } from "../../../shared/types/appTypes"

type MovableCoverComponentType = {
	movableCover: MovableCoverObject,
}

const MovableCover = ({ movableCover }: MovableCoverComponentType) => {
  console.log(movableCover.used)
	const {
    appSettings: { screenSettings, gameInformation: { cursorActions }
  }, setAppSettings }: AppSettingsContextType = useContext(AppSettingsContext)
	const [spriteCoordinate, setSpriteCoordinate] = useState<PointData>({} as PointData)

  const drawCircle = useCallback((g: GraphicsContext) => {
    g.circle(0, 0, 25)
      .fill({ color: 0xc2c2c2 })
      .stroke({ width: 3, color: 0xFFFFFF })
  }, [])

  const openCursorActions = (event: FederatedPointerEvent) => {
    const position: CursorActions = {
      position: cursorActions.position === null ? event.screen : null,
      examine: movableCover.inspectionData,
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

  if (!movableCover.used) {
    return (
      <pixiGraphics
        x={spriteCoordinate.x}
        y={spriteCoordinate.y}
        draw={(g: Graphics) => drawCircle(g.context)}
        eventMode="static"
        cursor="pointer"
        onRightClick={openCursorActions}
      >
        <pixiText
          text={'🧩'}
          anchor={0.5}
          x={0}
          y={0}
          style={{
            fill: 0xffec99,
            fontSize: 25,
            fontWeight: 'bold'
          }}
        />
      </pixiGraphics>
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