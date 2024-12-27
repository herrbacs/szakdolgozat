import { Navigation } from './components/Navigation'
import { useContext, useEffect, useState } from 'react'
import { AppSettingsContext } from './context/AppSettingsContext'
import { Stage } from './Stage'
import Game from './components/Game'
import { SetAppSettingsAction } from './shared/enums'
import { AppStoreState } from './shared/types'
import React from 'react'
import AppOverlay from './components/AppOverlay'

export default function App() {
  const { appSettings: { screenSettings: { dimension: { width, height } } }, setAppSettings } : { appSettings: AppStoreState, setAppSettings: any } = useContext(AppSettingsContext)
  const [levelLoaded, setLevelLoaded] = useState(false)

  useEffect(() => {
    async function generateLevel() {
      const response = await fetch('http://localhost:5000/generate-level', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if(!response.ok) {
        console.error(response)
        return
      }

      setAppSettings({ action: SetAppSettingsAction.LOAD_LEVEL , payload: await response.json() });
      setLevelLoaded(true)
    }

    generateLevel()
    console.log('Level Generated')
  }, []);

  return (
    <>
    {levelLoaded &&
      <>
      <div style={{position: 'relative', width: `${width}px`, overflow: 'hidden'}}>
        <Stage width={width} height={height} options={{ background: 0xeef1f5 }}>
          <Game/>
          <Navigation/>
        </Stage>
        <AppOverlay/>
      </div>
      </>
    }
   </>
  )
}
