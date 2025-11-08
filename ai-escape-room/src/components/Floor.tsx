import { Graphics } from '@pixi/react'
import { useCallback, useContext } from 'react'
import { AppSettingsContext } from '../context/AppSettingsContext'
import React from 'react'
import { AppSettingsContextType } from '../shared/types/frameworkTypes'

const Floor = () => {
    const { appSettings: { screenSettings: { dimension : { width, height }, perspective } }} : AppSettingsContextType = useContext(AppSettingsContext)
    
    const draw = useCallback((g: any) => {
        g.clear()
        g.beginFill(0x784212)
        g.lineStyle(1, 0x784212, 1)
    
        const topLeft = { x: perspective, y: height-perspective }
        const topRight = { x: width-perspective, y: height-perspective }
        const bottomRight = { x: width, y: height }
        const bottomLeft = { x: 0, y: height }
    
        g.moveTo(topLeft.x, topLeft.y)
        g.lineTo(topRight.x, topRight.y)
        g.lineTo(bottomRight.x, bottomRight.y)
        g.lineTo(bottomLeft.x, bottomLeft.y)
        g.lineTo(topLeft.x, topLeft.y)
    
        g.endFill()
    }, [height, perspective, width])
    

  return (
    <>
        <Graphics draw={draw} />
    </>
  )
}

export default Floor