import React, { useCallback, useContext, useEffect, useState } from "react"
import { InspectableObject } from "../../../shared/types/gameObjectTypes"
import { AppSettingsContextType } from "../../../shared/types/frameworkTypes"
import { AppSettingsContext } from "../../../context/AppSettingsContext"
import { Graphics, GraphicsContext, PointData } from "pixi.js"
import { setPositionOn } from "../../../shared/positionCalculator"
import { SetAppSettingsActionEnum } from "../../../shared/enums"

type InspectableComponentType = {
	inspectable: InspectableObject,
}

const Inspectable = ({ inspectable }: InspectableComponentType) => {
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
			area: inspectable.position,
			screenSettings,
		}))
  }, [])

  return (
    <pixiGraphics
      x={spriteCoordinate.x}
      y={spriteCoordinate.y}
      draw={(g: Graphics) => drawCircle(g.context)}
      eventMode="static"
      cursor="pointer"
      onPointerTap={() => setAppSettings({ action: SetAppSettingsActionEnum.TOGGLE_OBJECT_INSPECTING, payload: inspectable.inspectionData })}
    >
      <pixiText
        text={'🔍'}
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

export default Inspectable