// @ts-expect-error: missing type declarations, but works at runtime
import { Graphics, TilingSprite } from '@pixi/react'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { AppSettingsContext } from '../../context/AppSettingsContext'
import React from 'react'
import { AppSettingsContextType } from '../../shared/types/frameworkTypes'
import floorTexture from '../../../assets/wooden_floor.jpg'
import * as PIXI from 'pixi.js'

const Floor = () => {
  const { 
    appSettings: { gameInformation: { indexes },
    screenSettings: { dimension : { width, height }, perspective } }
  } : AppSettingsContextType = useContext(AppSettingsContext)
  
  const [texture, setTexture] = useState<PIXI.Texture>()
  
  const maskRef = useRef<PIXI.Graphics>(null)
  const tilingRef = useRef<PIXI.TilingSprite>(null)

  const drawMask = useCallback((g: PIXI.Graphics) => {
    g.clear()
    g.beginFill(0xffffff)
    
    const topLeft = { x: perspective, y: height-perspective }
    const topRight = { x: width-perspective, y: height-perspective }
    const bottomRight = { x: width, y: height }
    const bottomLeft = { x: 0, y: height }
    
    g.moveTo(topLeft.x, topLeft.y)
    g.lineTo(topRight.x, topRight.y)
    g.lineTo(bottomRight.x, bottomRight.y)
    g.lineTo(bottomLeft.x, bottomLeft.y)
    g.lineTo(topLeft.x, topLeft.y)
  
  }, [height, perspective, width])

  useEffect(() => {
    const texture = PIXI.Texture.from(floorTexture)
    texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT
    setTexture(texture)
  }, [])

  useEffect(() => {
    if (tilingRef.current) {
      const t = tilingRef.current
      t.tileTransform.rotation += Math.PI / 2
    }
  }, [indexes.currentWall])

  return (
    <>
      {texture && (
        <TilingSprite
          ref={tilingRef}
          texture={texture}
          width={width}
          height={height}
          tileScale={{ x: 0.5, y: 0.5 }}
          mask={maskRef.current}
        />
      )}
      <Graphics ref={maskRef} draw={drawMask} />
    </>
  )
}

export default Floor
