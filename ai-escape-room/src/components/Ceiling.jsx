import { Graphics } from '@pixi/react'
import { useCallback, useContext } from 'react'
import { AppSettingsContext } from '../context/AppSettingsContext'

const Ceiling = ({ color }) => {
    const { appSettings } = useContext(AppSettingsContext)

    const draw = useCallback((g) => {
        g.clear()
        g.beginFill(0x808080)
        g.lineStyle(1, 0x808080, 1)
    
        const topLeft = { x: 0, y: 0 }
        const topRight = { x: appSettings.screen.width, y: 0 }
        const bottomRight = { x: appSettings.screen.width - 150, y: 150 }
        const bottomLeft = { x: 150, y: 150 }
    
        g.moveTo(topLeft.x, topLeft.y)
        g.lineTo(topRight.x, topRight.y)
        g.lineTo(bottomRight.x, bottomRight.y)
        g.lineTo(bottomLeft.x, bottomLeft.y)
        g.lineTo(topLeft.x, topLeft.y)
    
        g.endFill()
    }, [appSettings.screen.width])
    

  return (
    <>
        <Graphics draw={draw} />
    </>
  )
}

export default Ceiling