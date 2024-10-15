import { Graphics } from '@pixi/react'
import { useCallback, useContext } from 'react'
import { AppSettingsContext } from '../context/AppSettingsContext'

const RightWall = () => {
  const { appSettings: { screen: { width, height, offset }, game: { rightWallIndex }, levelInformation: { walls }} } = useContext(AppSettingsContext)
  const { color } = walls[Math.abs(rightWallIndex)]
    
    const draw = useCallback((g) => {
      console.log('Render Right Wall')
        g.clear()
        g.beginFill(color)
        g.lineStyle(1, color, 1)

        const topLeft = { x: width-offset, y: offset }
        const topRight = { x: width, y: 0 }
        const bottomRight = { x: width, y: height }
        const bottomLeft = { x: width-offset, y: height-offset }

        g.moveTo(topLeft.x, topLeft.y)
        g.lineTo(topRight.x, topRight.y)
        g.lineTo(bottomRight.x, bottomRight.y)
        g.lineTo(bottomLeft.x, bottomLeft.y)
        g.lineTo(topLeft.x, topLeft.y)

        g.endFill()
    }, [color, height, offset, width])

  return (
    <>
        <Graphics draw={draw} />
    </>
  )
}

export default RightWall