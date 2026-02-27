
import React from 'react'
import { FederatedPointerEvent, PointData, Texture } from 'pixi.js'
import { useCallback, useContext } from 'react'
import { ExitObject } from '../../../shared/types/gameObjectTypes'
import { AppSettingsContext } from '../../../context/AppSettingsContext'
import { AppSettingsContextType } from '../../../shared/types/frameworkTypes'
import { useSprite } from '../../../useHooks/useSprites'
import { LockTypeEnum, SetAppSettingsActionEnum } from '../../../shared/enums'
import { CursorActions } from '../../../shared/types/appTypes'

const Exit = ({ exit: { id, lock, inspectionData } } : { exit: ExitObject }) => {
  const { type, activator, open } = lock
  const {
     appSettings: { 
      screenSettings: { dimension: { width, height }, perspective },
      gameInformation: { cursorActions, selectedItem, levelId } 
    }, 
    setAppSettings
  }: AppSettingsContextType = useContext(AppSettingsContext)

  const openendSprite = useSprite(levelId, 'door_open')
  const closedSprite = useSprite(levelId, 'door_closed')

  const tryOpen = useCallback(() => {
    if (type !== LockTypeEnum.KEY) {
      setAppSettings({
        action: SetAppSettingsActionEnum.SET_LOCK_MODAL,
        payload: {
          parentObjectId: id,
          title: inspectionData.appellation,
          lock,
          openCallback: () => setAppSettings({ action: SetAppSettingsActionEnum.EXIT })
        }
      })
    }

    if (selectedItem === null ||selectedItem.id !== activator) {
      return
    }

    if (!selectedItem.reusable) {
      setAppSettings({ action: SetAppSettingsActionEnum.DESTROY_INVENTORY_ITEM, payload: selectedItem })
    }

    setAppSettings({ action: SetAppSettingsActionEnum.EXIT })
  }, [selectedItem])

  const setPivotToBottomLeft = (): PointData =>
    (openendSprite.spriteLoaded && closedSprite.spriteLoaded)
    && open
      ? {
        x: openendSprite.sprite.width / 2,
        y: openendSprite.sprite.height,
      }
      : {
        x: closedSprite.sprite.width / 2,
        y: closedSprite.sprite.height,
      }

  const calculateScale = () => {
    const targetHeight = (height - 2 * perspective) * 0.75
    const sprite = open ? openendSprite.sprite : closedSprite.sprite
    if (sprite === Texture.EMPTY) {
      return { x: 1, y: 1 }
    }

    const scaleY = targetHeight / sprite.height
    const scaleX = scaleY

    return { x: scaleX, y: scaleY }
  }

  const openCursorActions = (event: FederatedPointerEvent) => {
    if (lock.open) {
      return
    }

    const position: CursorActions = {
      position: cursorActions.position === null ? event.screen : null,
      examine: { ...inspectionData, id: open ? 'door_open' : 'door_closed' },
      use: { action: tryOpen },
      take: null,
      search: null,
    }

    setAppSettings({
      action: SetAppSettingsActionEnum.SET_CURSOR_ACTIONS,
      payload: position
    })
  }

  return closedSprite.spriteLoaded && openendSprite.spriteLoaded
    ? <pixiSprite
      eventMode="static"
      cursor="pointer"
      onClick={openCursorActions}
      texture={open ? openendSprite.sprite : closedSprite.sprite}
      pivot={setPivotToBottomLeft()}
      x={width / 2}
      y={height - perspective}
      scale={calculateScale()}
    />
    : null
}

export default Exit
