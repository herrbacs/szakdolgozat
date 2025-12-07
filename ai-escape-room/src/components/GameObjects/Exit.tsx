
import React from 'react'
import { Assets, PointData, Texture } from 'pixi.js'
import { useCallback, useContext, useEffect, useState } from 'react'
import { AppSettingsContext } from '../../context/AppSettingsContext'
import { LockTypeEnum, SetAppSettingsActionEnum } from '../../shared/enums'
import { AppSettingsContextType } from '../../shared/types/frameworkTypes'
import { ExitObject } from '../../shared/types/gameObjectTypes'

const Exit = ({ exit: { lock: { type, activator, open } } }: { exit: ExitObject }) => {
  const { appSettings: { screenSettings: { dimension: { width, height }, perspective }, gameInformation: { selectedItem } }, setAppSettings }: AppSettingsContextType = useContext(AppSettingsContext)
  const [openTexture, setOpenTexture] = useState<Texture>(Texture.EMPTY)
  const [closedTexture, setClosedTexture] = useState<Texture>(Texture.EMPTY)

  const tryOpen = useCallback(() => {
    if (type === LockTypeEnum.PASSWORD) {
      throw new Error("Implement password modal to open exit")
    }

    // if (selectedItem?.id !== activator) {
    //   return
    // }

    // setAppSettings({ action: SetAppSettingsActionEnum.DESTROY_INVENTORY_ITEM, payload: selectedItem })
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

  useEffect(() => {
    loadTextures()
  }, [])

  return closedTexture && openTexture
    ? <pixiSprite
      eventMode="static"
      cursor="pointer"
      onPointerTap={tryOpen}
      texture={open ? openTexture : closedTexture}
      pivot={setPivotToBottomLeft()}
      x={width / 2}
      y={height - perspective}
      scale={calculateScale()}
    />
    : null
}

export default Exit
