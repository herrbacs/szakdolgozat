import { Graphics } from '@pixi/react'
import { useCallback, useContext } from 'react'
import { AppSettingsContext } from '../context/AppSettingsContext'
import { AppSettingsContextType, AppStoreState } from '../shared/types'
import React from 'react'

const LeftWall = () => {
  const { appSettings: { screenSettings: { height, perspective }, game: { leftWallIndex }, levelInformation: { walls } }}: AppSettingsContextType = useContext(AppSettingsContext)
  const { color } = walls[Math.abs(leftWallIndex)]
    
    const draw = useCallback((g: any) => {
        g.clear()
        g.beginFill(color)
        g.lineStyle(1, color, 1)
    
        const topLeft = { x: 0, y: 0 }
        const topRight = { x: perspective, y: perspective }
        const bottomRight = { x: perspective, y: height-perspective }
        const bottomLeft = { x: 0, y: height }
    
        g.moveTo(topLeft.x, topLeft.y)
        g.lineTo(topRight.x, topRight.y)
        g.lineTo(bottomRight.x, bottomRight.y)
        g.lineTo(bottomLeft.x, bottomLeft.y)
        g.lineTo(topLeft.x, topLeft.y)
    
        g.endFill()
    }, [color, height, perspective])
    

  return (
    <>
        <Graphics draw={draw} />
    </>
  )
}

export default LeftWall