import { Navigation } from './components/Navigation'
import { useContext, useEffect, useState } from 'react'
import { AppSettingsContext } from './context/AppSettingsContext'
import { Stage } from './Stage'
import Game from './components/Game'
import { SetAppSettingsAction } from './shared/enums'

export default function App() {
  const { appSettings, setAppSettings } = useContext(AppSettingsContext)
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
        console.log(data)
        setAppSettings({ action: SetAppSettingsAction.SET_LEVEL , payload: data });
        setLevelLoaded(true)
      })
      .catch(error => console.log(error))
  }, [setAppSettings]);

  return (
    <>
    {levelLoaded &&
      <Stage width={appSettings.screen.width} height={appSettings.screen.height} options={{ background: 0xeef1f5 }}>
        <Game/>
        <Navigation/>
      </Stage>
    }
      
   </>
  )
}
