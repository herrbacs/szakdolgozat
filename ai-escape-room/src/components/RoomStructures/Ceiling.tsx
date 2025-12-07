import { Graphics, GraphicsContext } from 'pixi.js'
import React, { useCallback, useContext } from 'react'
import { AppSettingsContext } from '../../context/AppSettingsContext'
import { AppSettingsContextType } from '../../shared/types/frameworkTypes'

const Ceiling = () => {
    const { appSettings: { screenSettings: { dimension: { width }, perspective } } } : AppSettingsContextType = useContext(AppSettingsContext)
    
    const draw = useCallback((g: GraphicsContext) => {
      const topLeft = { x: 0, y: 0 }
      const topRight = { x: width, y: 0 }
      const bottomRight = { x: width - perspective, y: perspective }
      const bottomLeft = { x: perspective, y: perspective }

      g.clear()
        .moveTo(topLeft.x, topLeft.y)
        .lineTo(topRight.x, topRight.y)
        .lineTo(bottomRight.x, bottomRight.y)
        .lineTo(bottomLeft.x, bottomLeft.y)
        .closePath()
        .fill({ color: 0x808080 })
        .stroke({ color: 0x808080, width: 1 })
    }, [width, perspective])
    

  return <pixiGraphics draw={(g: Graphics) => draw(g.context)} />
}

export default Ceiling