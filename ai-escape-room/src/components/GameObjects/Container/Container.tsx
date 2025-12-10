import React, { useCallback, useContext, useEffect, useState } from "react"
import { ContainerObject, PickableObject } from "../../../shared/types/gameObjectTypes"
import { AppSettingsContextType } from "../../../shared/types/frameworkTypes"
import { AppSettingsContext } from "../../../context/AppSettingsContext"
import { Graphics, GraphicsContext, PointData } from "pixi.js"
import { setPositionOn } from "../../../shared/positionCalculator"
import { SetAppSettingsActionEnum } from "../../../shared/enums"
type ContainerComponentType = {
  container: ContainerObject,
}

const Container = ({ container }: ContainerComponentType) => {
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
        area: container.position,
        screenSettings,
      }))
  }, [])

  const handleContainer = () => {
    if (container.lock === null || container.lock.open) {
      setAppSettings({
        action: SetAppSettingsActionEnum.CONTAINER_SEARCH,
        payload: container
      })
      return
    }

    setAppSettings({
      action: SetAppSettingsActionEnum.SET_LOCK_MODAL,
      payload: {
        lock: container.lock,
        openCallback: () => setAppSettings({ action: SetAppSettingsActionEnum.CONTAINER_OPEN, payload: container })
      }
    })
  }

  return (
    <pixiGraphics
      x={spriteCoordinate.x}
      y={spriteCoordinate.y}
      draw={(g: Graphics) => drawCircle(g.context)}
      eventMode="static"
      cursor="pointer"
      onPointerTap={handleContainer}
    >
      <pixiText
        text={container.lock === null ? '📦' : container.lock.open ? '🔓' : '🔒'}
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

export default Container