import { Assets, Graphics, GraphicsContext, Texture, TilingSprite } from 'pixi.js'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { AppSettingsContext } from '../../context/AppSettingsContext'
import React from 'react'
import { AppSettingsContextType } from '../../shared/types/frameworkTypes'
import floorTexture from '../../../assets/wooden_floor.jpg'

const Floor = () => {
  const ROTATION_0 = 0
  const ROTATION_90 = Math.PI / 2
  const ROTATION_180 = Math.PI
  const ROTATION_270 = (3 * Math.PI) / 2
  const rotations = [ROTATION_0, ROTATION_90, ROTATION_180, ROTATION_270]

  const { 
    appSettings: { gameInformation: { indexes },
    screenSettings: { dimension : { width, height }, perspective } }
  } : AppSettingsContextType = useContext(AppSettingsContext)
  
  const [texture, setTexture] = useState<Texture>(Texture.EMPTY)
  const maskRef = useRef<Graphics>(null)
  const tilingRef = useRef<TilingSprite>(null)

  const drawMask = useCallback((g: GraphicsContext) => {
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
      .fill({ color: 0xffffff })
  }, [height, perspective, width])

  useEffect(() => {
    if (texture !== Texture.EMPTY) {
        return
    }
    Assets
      .load(floorTexture)
      .then((result) => setTexture(result))
  }, [texture]);

  useEffect(() => {
    if (!tilingRef.current) {
      return
    }

    const t = tilingRef.current
    t.tileTransform.rotation = rotations[indexes.currentWall]
  }, [indexes.currentWall])

  return (
    <>
      {texture && (
        <pixiTilingSprite
          ref={tilingRef}
          texture={texture}
          width={width}
          height={height}
          tileScale={{ x: 0.5, y: 0.5 }}
          mask={maskRef.current}
        />
      )}
      <pixiGraphics ref={maskRef} draw={(g: Graphics) => drawMask(g.context)} />
    </>
  )
}

export default Floor
