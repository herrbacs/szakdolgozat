import React, { useCallback, useContext, useEffect, useState } from "react"
import { AppSettingsContextType } from "../../shared/types/frameworkTypes"
import { PickableObject } from "../../shared/types/gameObjectTypes"
import { SetAppSettingsActionEnum } from "../../shared/enums"
import { setPositionOn } from "../../shared/positionCalculator"
import { AppSettingsContext } from "../../context/AppSettingsContext"
import { Graphics, GraphicsContext, PointData, Texture } from "pixi.js"

type PickableComponentTypeProperties = {
	pickable: PickableObject,
}

const Pickable = ({ pickable }: PickableComponentTypeProperties) => {
	const scale = 0.1
	const { appSettings: { screenSettings }, setAppSettings } : AppSettingsContextType = useContext(AppSettingsContext)
	const [pickedUp, setPickedUp] = useState<Boolean>(false)
	const [spriteCoordinate, setSpriteCoordinate] = useState<PointData>({ x: 0, y: 0 })
  
  const handlePickUp = useCallback(() => {
		setAppSettings({ action: SetAppSettingsActionEnum.PICK_UP_ITEM , payload: pickable });
		setPickedUp(true)
	}, [])

  const drawCircle = useCallback((g: GraphicsContext) => {
    g.circle(0, 0, 25)
      .fill({ color: 0xc2c2c2 })
      .stroke({ width: 3, color: 0xFFFFFF })
  }, [])

  useEffect(() => {
		setSpriteCoordinate(
      setPositionOn({ 
        area: pickable.position,
        screenSettings,
        scale,
        perspective: false
      })
    )
	}, [])

  return !pickedUp
    ? <pixiGraphics
          x={spriteCoordinate.x}
          y={spriteCoordinate.y}
          draw={(g: Graphics) => drawCircle(g.context)}
          eventMode="static"
          cursor="pointer"
          onPointerTap={handlePickUp}
        >
          <pixiText
            text={'⭐'}
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
    : null
}

export default Pickable