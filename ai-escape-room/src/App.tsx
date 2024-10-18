import { Navigation } from './components/Navigation'
import { useContext, useEffect, useState } from 'react'
import { AppSettingsContext } from './context/AppSettingsContext'
import { Stage } from './Stage'
import Game from './components/Game'
import { SetAppSettingsAction } from './shared/enums'
import { AppStoreState } from './shared/types'
import React from 'react'

export default function App() {
  const { appSettings, setAppSettings } : { appSettings: AppStoreState, setAppSettings: any } = useContext(AppSettingsContext)
  const [levelLoaded, setLevelLoaded] = useState(false)

  useEffect(() => {
    fetch('http://localhost:5000/generate-level', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        console.log("Render Level")
        setAppSettings({ action: SetAppSettingsAction.SET_LEVEL , payload: data });
        setLevelLoaded(true)
      })
      .catch(error => console.log(error))
  }, []);

  return (
    <>
    {levelLoaded &&
      <Stage width={appSettings.screenSettings.width} height={appSettings.screenSettings.height} options={{ background: 0xeef1f5 }}>
        <Game/>
        <Navigation/>
      </Stage>
    }
      
   </>
  )
}
