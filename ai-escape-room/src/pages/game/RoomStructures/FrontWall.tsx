import { Graphics, GraphicsContext } from 'pixi.js'
import { useCallback, useContext } from 'react'
import React from 'react'
import { AppSettingsContext } from '../../../context/AppSettingsContext'
import { AppSettingsContextType } from '../../../shared/types/frameworkTypes'

const FrontWall = ({ color } : { color: string }) => {
  const { appSettings: { screenSettings: { dimension: { width, height }, perspective} } } : AppSettingsContextType = useContext(AppSettingsContext)

  const draw = useCallback((g: GraphicsContext) => {
    g.clear()
      .rect(perspective, perspective, width - perspective * 2, height - perspective * 2)
      .fill({ color })
    },
    [color],
  )

  return <pixiGraphics draw={(g: Graphics) => draw(g.context)} />
}

export default FrontWall