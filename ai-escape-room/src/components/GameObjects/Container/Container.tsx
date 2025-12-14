import React, { useCallback, useContext, useEffect, useState } from "react"
import { ContainerObject, PickableObject } from "../../../shared/types/gameObjectTypes"
import { AppSettingsContextType } from "../../../shared/types/frameworkTypes"
import { AppSettingsContext } from "../../../context/AppSettingsContext"
import { FederatedPointerEvent, Graphics, GraphicsContext, PointData } from "pixi.js"
import { setPositionOn } from "../../../shared/positionCalculator"
import { LockTypeEnum, SetAppSettingsActionEnum } from "../../../shared/enums"
import { CursorActions } from "../../../shared/types/appTypes"

type ContainerComponentType = {
  container: ContainerObject,
}

const Container = ({ container }: ContainerComponentType) => {
  const { 
    appSettings: { 
      screenSettings,
      gameInformation: { cursorActions, selectedItem } },
    setAppSettings
  }: AppSettingsContextType = useContext(AppSettingsContext)
  const [spriteCoordinate, setSpriteCoordinate] = useState<PointData>({} as PointData)

  const drawCircle = useCallback((g: GraphicsContext) => {
    g.circle(0, 0, 25)
      .fill({ color: 0xc2c2c2 })
      .stroke({ width: 3, color: 0xFFFFFF })
  }, [])

  const tryKeyOpen = () => {
    if (selectedItem?.id !== container.lock!.activator) {
      return
    }

    if (!selectedItem.reusable) {
      setAppSettings({ action: SetAppSettingsActionEnum.DESTROY_INVENTORY_ITEM, payload: selectedItem })
    }

    setAppSettings({ action: SetAppSettingsActionEnum.CONTAINER_OPEN, payload: container })
  }

  const handleContainer = () => {
    if (container.lock === null || container.lock.open) {
      setAppSettings({
        action: SetAppSettingsActionEnum.CONTAINER_SEARCH,
        payload: container
      })
      return
    }

    if (container.lock.type !== LockTypeEnum.KEY) {
      setAppSettings({
        action: SetAppSettingsActionEnum.SET_LOCK_MODAL,
        payload: {
          lock: container.lock,
          openCallback: () => setAppSettings({ action: SetAppSettingsActionEnum.CONTAINER_OPEN, payload: container })
        }
      })
      return
    }

    tryKeyOpen()
  }

  const openCursorActions = (event: FederatedPointerEvent) => {
    const use = container.lock === null || container.lock.open
      ? null
      : { action: handleContainer }

    const search = container.lock === null || container.lock.open
      ? { action: handleContainer }
      : null

    const position: CursorActions = {
      position: cursorActions.position === null ? event.screen : null,
      examine: container.inspectionData,
      take: null,
      use,
      search,
    }

    setAppSettings({
      action: SetAppSettingsActionEnum.SET_CURSOR_ACTIONS,
      payload: position
    })
  }

  useEffect(() => {
    setSpriteCoordinate(
      setPositionOn({
        area: container.position,
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
      onRightClick={openCursorActions}
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