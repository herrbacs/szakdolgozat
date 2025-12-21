import React from 'react'
import { Graphics, GraphicsContext } from 'pixi.js'
import { useCallback, useContext } from 'react'
import { AppSettingsContext } from '../../context/AppSettingsContext'
import { AppSettingsContextType } from '../../shared/types/frameworkTypes'

const Floor = () => {
  const {
    appSettings: { screenSettings: { dimension: { width, height }, perspective } }
  }: AppSettingsContextType = useContext(AppSettingsContext)

  const draw = useCallback((g: GraphicsContext) => {
    const topLeft = { x: perspective, y: height - perspective }
    const topRight = { x: width - perspective, y: height - perspective }
    const bottomRight = { x: width, y: height }
    const bottomLeft = { x: 0, y: height }

    g.clear()
      .moveTo(topLeft.x, topLeft.y)
      .lineTo(topRight.x, topRight.y)
      .lineTo(bottomRight.x, bottomRight.y)
      .lineTo(bottomLeft.x, bottomLeft.y)
      .closePath()
      .fill({ color: 0x555555 })
  }, [height, perspective, width])

  return <pixiGraphics draw={(g: Graphics) => draw(g.context)} />
}

export default Floor
