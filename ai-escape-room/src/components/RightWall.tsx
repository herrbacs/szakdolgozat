import { Graphics } from '@pixi/react'
import { useCallback, useContext } from 'react'
import { AppSettingsContext } from '../context/AppSettingsContext'
import React from 'react'
import { AppSettingsContextType } from '../shared/types'

const RightWall = () => {
  const { appSettings: { screenSettings: { width, height, perspective }, game: { rightWallIndex }, levelInformation: { walls }}} : AppSettingsContextType = useContext(AppSettingsContext)
  const { color } = walls[Math.abs(rightWallIndex)]
    
    const draw = useCallback((g: any) => {
        g.clear()
        g.beginFill(color)
        g.lineStyle(1, color, 1)

        const topLeft = { x: width-perspective, y: perspective }
        const topRight = { x: width, y: 0 }
        const bottomRight = { x: width, y: height }
        const bottomLeft = { x: width-perspective, y: height-perspective }

        g.moveTo(topLeft.x, topLeft.y)
        g.lineTo(topRight.x, topRight.y)
        g.lineTo(bottomRight.x, bottomRight.y)
        g.lineTo(bottomLeft.x, bottomLeft.y)
        g.lineTo(topLeft.x, topLeft.y)

        g.endFill()
    }, [color, height, perspective, width])

  return (
    <>
        <Graphics draw={draw} />
    </>
  )
}

export default RightWall