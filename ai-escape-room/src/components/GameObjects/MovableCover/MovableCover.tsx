import React, { useCallback, useContext, useEffect, useState } from "react"
import { ContainerObject, InspectableObject, MovableCoverObject, PickableObject } from "../../../shared/types/gameObjectTypes"
import { AppSettingsContextType } from "../../../shared/types/frameworkTypes"
import { AppSettingsContext } from "../../../context/AppSettingsContext"
import { Graphics, GraphicsContext, PointData } from "pixi.js"
import { setPositionOn } from "../../../shared/positionCalculator"
import { GameObjectTypeEnum, SetAppSettingsActionEnum } from "../../../shared/enums"
import Pickable from "../Pickable"
import Inspectable from "../Inspectable/Inspectable"
import Container from "../Container/Container"

type MovableCoverComponentType = {
	movableCover: MovableCoverObject,
}

const MovableCover = ({ movableCover }: MovableCoverComponentType) => {
	const { appSettings: { screenSettings }, setAppSettings }: AppSettingsContextType = useContext(AppSettingsContext)
	const [spriteCoordinate, setSpriteCoordinate] = useState<PointData>({} as PointData)

  const drawCircle = useCallback((g: GraphicsContext) => {
    g.circle(0, 0, 25)
      .fill({ color: 0xc2c2c2 })
      .stroke({ width: 3, color: 0xFFFFFF })
  }, [])

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
        onPointerTap={() => setAppSettings({ action: SetAppSettingsActionEnum.REMOVE_COVER, payload: movableCover })}
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