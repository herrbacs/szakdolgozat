import React, { useContext, useEffect, useRef, useState } from 'react';
import { useCallback, useMemo } from 'react';
import { AppSettingsContext } from '../../context/AppSettingsContext'
import { AppSettingsContextType } from '../../shared/types/frameworkTypes'
import { Assets, Graphics, GraphicsContext, Texture } from 'pixi.js';
import { SetAppSettingsActionEnum } from '../../shared/enums';
import { emptyCursorActions } from '../../reducer/controllerHelpers';

const CursorActions = () => {
  const {
    appSettings: { gameInformation: { cursorActions: { position, examine, search, take, use } } },
    setAppSettings
  }: AppSettingsContextType = useContext(AppSettingsContext)

  const actionSize = 60
  const padding = 10

  const [examineTexture, setExamineTexture] = useState<Texture>(Texture.EMPTY)
  const [searchTexture, setSearchTexture] = useState<Texture>(Texture.EMPTY)
  const [takeTexture, setTakeTexture] = useState<Texture>(Texture.EMPTY)
  const [useTexture, setUseTexture] = useState<Texture>(Texture.EMPTY)

  const drawContainer = useCallback((g: GraphicsContext) => {
    const height = actionSize + padding
    let width = padding

    if (examine !== null) {
      width += actionSize + padding
    }
    if (search) {
      width += actionSize + padding
    }
    if (take) {
      width += actionSize + padding
    }
    if (use) {
      width += actionSize + padding
    }

    g.clear()
      .rect(0, 0, width, height)
      .fill(0xffe066)
  }, [position, examine, search, take, use])

  const loadTextures = async () => {
    const examine = await Assets.load('http://localhost:5000/images/cursor_examine.jpg')
    const search = await Assets.load('http://localhost:5000/images/cursor_search.jpg')
    const take = await Assets.load('http://localhost:5000/images/cursor_take.jpg')
    const use = await Assets.load('http://localhost:5000/images/cursor_use.jpg')

    setExamineTexture(examine)
    setSearchTexture(search)
    setTakeTexture(take)
    setUseTexture(use)

    if (!examine || !search || !take || !use) {
      throw new Error('Failed To CursorActions')
    }
  }

  const calculateScale = (texture: Texture): number => {
    const scaleX = actionSize / texture.width
    const scaleY = actionSize / texture.height
    return Math.min(scaleX, scaleY)
  }

  const examineItem = () => {
    setAppSettings({ action: SetAppSettingsActionEnum.TOGGLE_OBJECT_INSPECTING, payload: examine })
  }

  const getActions = () => {
    const arr = []
    if (examine) {
      arr.push({ texture: examineTexture, action: examineItem })
    }
    if (search) {
      arr.push({ texture: searchTexture, action: search.action })
    }
    if (take) {
      arr.push({ texture: takeTexture, action: take.action })
    }
    if (use) {
      arr.push({ texture: useTexture, action: use.action })
    }

    return arr
  }

  const handleAction = (action: () => void) => {
    setAppSettings({ action: SetAppSettingsActionEnum.SET_CURSOR_ACTIONS, payload: emptyCursorActions() })
    action()
  }

  useEffect(() => {
    loadTextures()
  }, [])

  return position && (
    <pixiGraphics
      x={position.x}
      y={position.y}
      draw={(g: Graphics) => drawContainer(g.context)}
      eventMode="static"
      cursor="pointer"
    >
      {
        getActions().map(({ texture, action }, index) => (<pixiSprite
          key={index}
          eventMode="static"
          cursor="pointer"
          onPointerTap={() => handleAction(action)}
          texture={texture}
          x={padding + index * (actionSize + padding)}
          y={padding}
          scale={calculateScale(examineTexture)}
        />))
      }
    </pixiGraphics>
  )
}

export default CursorActions
