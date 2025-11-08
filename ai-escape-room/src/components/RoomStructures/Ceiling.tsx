import { Graphics } from '@pixi/react'
import React, { useCallback, useContext } from 'react'
import { AppSettingsContext } from '../../context/AppSettingsContext'
import { AppSettingsContextType } from '../../shared/types/frameworkTypes'

const Ceiling = () => {
    const { appSettings: { screenSettings: { dimension: { width }, perspective } } } : AppSettingsContextType = useContext(AppSettingsContext)
    
    const draw = useCallback((g: any) => {
        g.clear()
        g.beginFill(0x808080)
        g.lineStyle(1, 0x808080, 1)
    
        const topLeft = { x: 0, y: 0 }
        const topRight = { x: width, y: 0 }
        const bottomRight = { x: width - perspective, y: perspective }
        const bottomLeft = { x: perspective, y: perspective }
    
        g.moveTo(topLeft.x, topLeft.y)
        g.lineTo(topRight.x, topRight.y)
        g.lineTo(bottomRight.x, bottomRight.y)
        g.lineTo(bottomLeft.x, bottomLeft.y)
        g.lineTo(topLeft.x, topLeft.y)
    
        g.endFill()
    }, [width, perspective])
    

  return (
    <>
        <Graphics draw={draw} />
    </>
  )
}

export default Ceiling