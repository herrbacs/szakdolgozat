
import React from 'react'
import { Assets, FederatedPointerEvent, FederatedWheelEvent, PointData, Texture } from 'pixi.js'
import { useCallback, useContext, useEffect, useState } from 'react'
import { AppSettingsContext } from '../../context/AppSettingsContext'
import { LockTypeEnum, SetAppSettingsActionEnum } from '../../shared/enums'
import { AppSettingsContextType } from '../../shared/types/frameworkTypes'
import { ExitObject } from '../../shared/types/gameObjectTypes'
import { CursorActions } from '../../shared/types/appTypes'

const Exit = ({ exit: { lock } }: { exit: ExitObject }) => {
  const { type, activator, open } = lock
  const {
     appSettings: { screenSettings: { dimension: { width, height }, perspective },
     gameInformation: { cursorActions, selectedItem } 
  }, setAppSettings}: AppSettingsContextType = useContext(AppSettingsContext)
  const [openTexture, setOpenTexture] = useState<Texture>(Texture.EMPTY)
  const [closedTexture, setClosedTexture] = useState<Texture>(Texture.EMPTY)

  const tryOpen = useCallback(() => {
    if (type === LockTypeEnum.PASSWORD) {
      setAppSettings({
        action: SetAppSettingsActionEnum.SET_LOCK_MODAL,
        payload: {
          lock,
          openCallback: () => setAppSettings({ action: SetAppSettingsActionEnum.EXIT })
        }
      })
    }

    if (selectedItem?.id !== activator) {
      return
    }

    if (!selectedItem.reusable) {
      setAppSettings({ action: SetAppSettingsActionEnum.DESTROY_INVENTORY_ITEM, payload: selectedItem })
    }

    setAppSettings({ action: SetAppSettingsActionEnum.EXIT })
  }, [selectedItem])

  const loadTextures = async () => {
    const open = await Assets.load('http://localhost:5000/images/exit_open.png')
    const closed = await Assets.load('http://localhost:5000/images/exit_closed.png')

    setOpenTexture(open)
    setClosedTexture(closed)

    if (!open || !closed) {
      throw new Error('Failed To Load Exit Sprites')
    }
  }

  const setPivotToBottomLeft = (): PointData =>
    open
      ? {
        x: openTexture.width / 2,
        y: openTexture.height,
      }
      : {
        x: closedTexture.width / 2,
        y: closedTexture.height,
      }

  const calculateScale = () => {
    const targetHeight = (height - 2 * perspective) * 0.75
    const texture = open ? openTexture : closedTexture
    if (texture === Texture.EMPTY) {
      return { x: 1, y: 1 }
    }

    const scaleY = targetHeight / texture.height
    const scaleX = scaleY

    return { x: scaleX, y: scaleY }
  }

  const openCursorActions = (event: FederatedPointerEvent) => {
    if (lock.open) {
      return
    }

    const position: CursorActions = {
      position: cursorActions.position === null ? event.screen : null,
      examine: {
        appellation: "Exit Door",
        information: lock.open ? "Yaaay, I'm free" : "I need to get out"
      },
      use: {
        action: tryOpen
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
    loadTextures()
  }, [])

  return closedTexture && openTexture
    ? <pixiSprite
      eventMode="static"
      cursor="pointer"
      onRightClick={openCursorActions}
      texture={open ? openTexture : closedTexture}
      pivot={setPivotToBottomLeft()}
      x={width / 2}
      y={height - perspective}
      scale={calculateScale()}
    />
    : null
}

export default Exit
