import React, { useContext, useEffect, useRef, useState } from 'react'
import { AppSettingsContextType } from '../../shared/types/frameworkTypes'
import { AppSettingsContext } from '../../context/AppSettingsContext'
import AppHtmlOverlay from '../../pages/game/HtmlComponents/AppHtmlOverlay'
import {
  Application,
  extend,
} from '@pixi/react'
import {
  Container,
  Graphics,
  Sprite,
  Text,
  TilingSprite,
} from 'pixi.js'
import { SetAppSettingsActionEnum } from '../../shared/enums'
import GameScene from '../../pages/game/GameScene'
import UserInterface from '../../pages/game/Application/UserInterface/UserInterface'
import { loadLevelUrl } from '../../shared/urls'

extend({
  Container,
  Graphics,
  Sprite,
  Text,
  TilingSprite,
})

const GamePage: React.FC = () => {
  const {
    appSettings: {
      screenSettings: { dimension: { width, height } },
    },
    setAppSettings,
  }: AppSettingsContextType = useContext(AppSettingsContext)
  const parentRef = useRef(null)
  const appRef = useRef<any>(null)

  const [levelLoaded, setLevelLoaded] = useState<boolean>(false)

  const disableRightClickDefaultBehavior = () => {
    const handler = (e: MouseEvent) => {
      e.preventDefault()
      return false
    }

    document.addEventListener('contextmenu', handler)

    return () => {
      document.removeEventListener('contextmenu', handler)
    }
  }

  const loadLevel = async () => {
    const levelUrl = loadLevelUrl('a727bd4e-6762-4f60-bf3a-6917a00eb92d')
    const response = await fetch(levelUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      console.error(response)
      throw new Error('Failed To Load Level')
    }

    setAppSettings({ action: SetAppSettingsActionEnum.LOAD_LEVEL, payload: await response.json() })
    setLevelLoaded(true)
  }

  useEffect(() => {
    loadLevel()
  }, [])
  useEffect(disableRightClickDefaultBehavior, [])

  return levelLoaded ? (
    <div
      ref={parentRef}
      style={{ position: 'relative', width: `${width}px`, height: `${height}px`, overflow: 'hidden' }}
    >
      <Application ref={appRef} resizeTo={parentRef}>
        <GameScene />
        <UserInterface />
      </Application>
      <AppHtmlOverlay />
    </div>
  ) : (
    <h1>Loading Level</h1>
  )
}

export default GamePage
