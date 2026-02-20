import React, { useCallback, useContext, useEffect, useState } from "react"
import { ContainerObject, PickableObject } from "../../../shared/types/gameObjectTypes"
import { AppSettingsContextType } from "../../../shared/types/frameworkTypes"
import { AppSettingsContext } from "../../../context/AppSettingsContext"
import { FederatedPointerEvent, Graphics, GraphicsContext, PointData } from "pixi.js"
import { setPositionOn } from "../../../shared/positionCalculator"
import { LockTypeEnum, SetAppSettingsActionEnum } from "../../../shared/enums"
import { CursorActions } from "../../../shared/types/appTypes"
import { useSprite } from "../../../useHooks/useSprites"

type ContainerComponentType = {
  container: ContainerObject,
}

const Container = ({ container }: ContainerComponentType) => {
  const { 
    appSettings: { 
      screenSettings,
      gameInformation: { cursorActions, selectedItem, levelId } },
    setAppSettings
  }: AppSettingsContextType = useContext(AppSettingsContext)
  const [spriteCoordinate, setSpriteCoordinate] = useState<PointData>({} as PointData)
  const { sprite, spriteLoaded } = useSprite(levelId, container.id)

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
          parentObjectId: container.id,
          title: container.inspectionData.appellation,
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

export default Container