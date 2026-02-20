import React, { useContext, useEffect, useState } from 'react';
import { AppSettingsContext } from '../../../context/AppSettingsContext'
import { AppSettingsContextType } from '../../../shared/types/frameworkTypes'
import { Assets, Texture } from 'pixi.js';
import { SetAppSettingsActionEnum } from '../../../shared/enums';
import { emptyCursorActions } from '../../../reducer/controllerHelpers';
import { spriteUrl } from '../../../shared/urls';

const ToggleInventory = () => {
  const { 
    appSettings: {
      screenSettings: { dimension: { width } },
      gameInformation: { levelId }
    },
    setAppSettings
  }: AppSettingsContextType = useContext(AppSettingsContext)
  const padding = 25
  const [texture, setTexture] = useState<Texture>(Texture.EMPTY)
  const [scale, setScale] = useState<number>(1)

  const handleClick = () => {
    setAppSettings({
      action: SetAppSettingsActionEnum.SET_CURSOR_ACTIONS,
      payload: emptyCursorActions()
    })
    setAppSettings({ action: SetAppSettingsActionEnum.TOGGLE_INVENTORY })
  }

  const loadTextures = async () => {
    const texture = await Assets.load({
      src: spriteUrl(levelId, 'inventory'),
      parser: 'loadTextures',
    })

    if (!texture) {
      throw new Error('Failed To Load Inventory Sptrite')
    }

    setTexture(texture)
    setScale(75 / texture.width)
  }

  useEffect(() => {
    loadTextures()
  }, [])

  return (
    <pixiSprite
      texture={texture}
      eventMode="static"
      cursor="pointer"
      onPointerTap={handleClick}
      scale={scale}
      x={width - padding - texture.width * scale}
      y={padding}
    />
  )
}

export default ToggleInventory
