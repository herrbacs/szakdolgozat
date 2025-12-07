import { Graphics, GraphicsContext } from 'pixi.js'
import { useCallback, useContext } from 'react'
import { AppSettingsContext } from '../../context/AppSettingsContext'
import React from 'react'
import { AppSettingsContextType } from '../../shared/types/frameworkTypes'
import { PositionEnum } from '../../shared/enums'

const RightWall = () => {
  const { appSettings: { screenSettings: { dimension: { width, height }, perspective }, gameInformation: { walls, indexes }}} : AppSettingsContextType = useContext(AppSettingsContext)
  const { color } = walls[Math.abs(indexes.rightWall)]

  const draw = useCallback((g: GraphicsContext) => {
    const topLeft = { x: width - perspective, y: perspective }
    const topRight = { x: width, y: 0 }
    const bottomRight = { x: width, y: height }
    const bottomLeft = { x: width - perspective, y: height - perspective }

    g.clear()
      .moveTo(topLeft.x, topLeft.y)
      .lineTo(topRight.x, topRight.y)
      .lineTo(bottomRight.x, bottomRight.y)
      .lineTo(bottomLeft.x, bottomLeft.y)
      .closePath()
      .fill({ color })
      .stroke({ color, width: 1 })
  }, [color, height, perspective, width])

  const leftSideGameAreas = [
    PositionEnum.WT1,
    PositionEnum.W1,
    PositionEnum.WB1,
    PositionEnum.F1,
  ]

  return (
    <>
      <pixiGraphics draw={(g: Graphics) => draw(g.context)} />
        {/* {
          inspectables
            .filter((inspectable) => leftSideGameAreas.includes(inspectable.position))
            .map((inspectable) => <Inspectable key={inspectable.id} inspectable={inspectable} rightPerspective/>) 
        }
        {
          interactables
            .filter((interactable) => leftSideGameAreas.includes(interactable.position))
            .map((interactable) => <Interactable key={interactable.id} interactable={interactable} rightPerspective/>) 
        } */}
    </>
  )
}

export default RightWall