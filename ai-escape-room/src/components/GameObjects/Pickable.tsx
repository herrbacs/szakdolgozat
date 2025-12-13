import React, { useCallback, useContext, useEffect, useState } from "react"
import { AppSettingsContextType } from "../../shared/types/frameworkTypes"
import { PickableObject } from "../../shared/types/gameObjectTypes"
import { SetAppSettingsActionEnum } from "../../shared/enums"
import { setPositionOn } from "../../shared/positionCalculator"
import { AppSettingsContext } from "../../context/AppSettingsContext"
import { FederatedPointerEvent, Graphics, GraphicsContext, PointData, Texture } from "pixi.js"
import { CursorActions } from "../../shared/types/appTypes"

type PickableComponentTypeProperties = {
  pickable: PickableObject,
}

const Pickable = ({ pickable }: PickableComponentTypeProperties) => {
  const { appSettings: { screenSettings, gameInformation: { cursorActions } }, setAppSettings }: AppSettingsContextType = useContext(AppSettingsContext)
  const [pickedUp, setPickedUp] = useState<Boolean>(false)
  const [spriteCoordinate, setSpriteCoordinate] = useState<PointData>({ x: 0, y: 0 })

  const handlePickUp = useCallback(() => {
    setAppSettings({ action: SetAppSettingsActionEnum.PICK_UP_ITEM, payload: pickable });
    setPickedUp(true)
  }, [])

  const drawCircle = useCallback((g: GraphicsContext) => {
    g.circle(0, 0, 25)
      .fill({ color: 0xc2c2c2 })
      .stroke({ width: 3, color: 0xFFFFFF })
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

  return !pickedUp
    ? <pixiGraphics
      x={spriteCoordinate.x}
      y={spriteCoordinate.y}
      draw={(g: Graphics) => drawCircle(g.context)}
      eventMode="static"
      cursor="pointer"
      onRightClick={openCursorActions}
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