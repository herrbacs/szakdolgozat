import React, { useContext, useEffect, useRef, useState } from 'react'
import { AppSettingsContextType } from './shared/types/frameworkTypes'
import { AppSettingsContext } from './context/AppSettingsContext'
import AppHtmlOverlay from './components/HtmlComponents/AppHtmlOverlay'
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
import { SetAppSettingsActionEnum } from './shared/enums'
import GameScene from './components/GameScene'
import UserInterface from './components/Application/UserInterface/UserInterface'

extend({
  Container,
  Graphics,
  Sprite,
  Text,
  TilingSprite,
})

export default function App() {
  const { appSettings: { screenSettings: { dimension: { width, height } } }, setAppSettings }: AppSettingsContextType = useContext(AppSettingsContext)
  const parentRef = useRef(null)
  const appRef = useRef<any>(null)

  const [levelLoaded, setLevelLoaded] = useState<boolean>(false)

  const disableRightClickDefaultBehavior = () => {
    const handler = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener("contextmenu", handler);

    return () => {
      document.removeEventListener("contextmenu", handler);
    };
  }

  const generateLevel = async () => {
    const response = await fetch('http://localhost:5000/generate-level', {
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
    generateLevel()
  }, [])
  useEffect(disableRightClickDefaultBehavior, []);

  return levelLoaded
    ? (
      <div ref={parentRef} style={{ position: 'relative', width: `${width}px`, height: `${height}px`, overflow: 'hidden' }}>
        <Application ref={appRef} resizeTo={parentRef} >
          <GameScene />
          <UserInterface />
        </Application>
        <AppHtmlOverlay />
      </div>
    )
    : <h1>Loading Level</h1>
}
