import { Graphics } from '@pixi/react'
import { useCallback, useContext, useState } from 'react'
import { AppSettingsContext } from '../context/AppSettingsContext'
import React from 'react'
import { AppSettingsContextType, Wall } from '../shared/types'
import Inspectable from './GameObjects/Inspectable/Inspectable'

const RightWall = () => {
  const { appSettings: { screenSettings: { dimension: { width, height }, perspective }, gameInformation: { walls, indexes }}} : AppSettingsContextType = useContext(AppSettingsContext)
  const { color, inspectables } = walls[Math.abs(indexes.rightWall)]

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
        {
          inspectables.map((inspectable) => <Inspectable key={inspectable.id} inspectable={inspectable} rightPerspective/>) 
        }
    </>
  )
}

export default RightWall