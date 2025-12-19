import { Graphics, GraphicsContext, PointData } from 'pixi.js'
import React, { useCallback, useMemo } from 'react'

export enum TriangleDirection {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  UP_LEFT = 'UP_LEFT',
  UP_RIGHT = 'UP_RIGHT',
  DOWN_LEFT = 'DOWN_LEFT',
  DOWN_RIGHT = 'DOWN_RIGHT'
}

type PositionByXY = {
  x?: number
  y?: number
  position?: never
}

type PositionByPoint = {
  position: PointData
  x?: never
  y?: never
}

type TriangleProps = (PositionByXY | PositionByPoint) & {
  size?: number
  color?: number
  direction?: TriangleDirection
  onClick?: () => void
}

export function Triangle(props: TriangleProps) {
  const {
    size = 25,
    color = 0xffffff,
    direction = TriangleDirection.UP,
    onClick = () => {}
  } = props

  const rotation = useMemo(() => {
    switch (direction) {
      case TriangleDirection.UP: return 0
      case TriangleDirection.RIGHT: return Math.PI / 2
      case TriangleDirection.DOWN: return Math.PI
      case TriangleDirection.LEFT: return -Math.PI / 2
      case TriangleDirection.UP_RIGHT: return Math.PI / 4
      case TriangleDirection.UP_LEFT: return -Math.PI / 4
      case TriangleDirection.DOWN_RIGHT: return (3 * Math.PI) / 4
      case TriangleDirection.DOWN_LEFT: return (-3 * Math.PI) / 4
      default: return 0
    }
  }, [direction])

  const drawTriangle = useCallback((g: Graphics) => {
    const ctx = g.context as GraphicsContext

    const halfBase = size / 2
    const height = (Math.sqrt(3) / 2) * size

    ctx.clear()
      .moveTo(0, -height / 2)
      .lineTo(-halfBase, height / 2)
      .lineTo(halfBase, height / 2)
      .closePath()
      .fill({ color })
      .stroke({ color, width: 1 })
  }, [size, color])

  return (
    <pixiGraphics
      draw={drawTriangle}
      {
        ...(
          'position' in props
          ? { position: props.position }
          : { x: props.x ?? 0, y: props.y ?? 0 }
        )
      }
      rotation={rotation}
      eventMode="static"
      cursor="pointer"
      onPointerDown={onClick}
    />
  )
}
