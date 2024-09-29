import { Navigation } from './components/Navigation'
import { useContext } from 'react'
import { AppSettingsContext } from './context/AppSettingsContext'
import { Stage } from './Stage'

export default function App() {
  const { appSettings } = useContext(AppSettingsContext)

  return (
    <>
      <Stage width={appSettings.screen.width} height={appSettings.screen.height} options={{ background: 0x1099bb }}>
          <Navigation/>
      </Stage>
   </>
  )
}
