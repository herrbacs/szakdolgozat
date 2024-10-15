import { Graphics } from '@pixi/react'
import { useCallback, useContext } from 'react'
import { AppSettingsContext } from '../context/AppSettingsContext'

const LeftWall = () => {
  const { appSettings: { screen: { height, offset }, game: { leftWallIndex }, levelInformation: { walls }} } = useContext(AppSettingsContext)
  const { color } = walls[Math.abs(leftWallIndex)]
    
    const draw = useCallback((g) => {
        console.log("Render Left Wall")
        g.clear()
        g.beginFill(color)
        g.lineStyle(1, color, 1)
    
        const topLeft = { x: 0, y: 0 }
        const topRight = { x: offset, y: offset }
        const bottomRight = { x: offset, y: height-offset }
        const bottomLeft = { x: 0, y: height }
    
        g.moveTo(topLeft.x, topLeft.y)
        g.lineTo(topRight.x, topRight.y)
        g.lineTo(bottomRight.x, bottomRight.y)
        g.lineTo(bottomLeft.x, bottomLeft.y)
        g.lineTo(topLeft.x, topLeft.y)
    
        g.endFill()
    }, [color, height, offset])
    

  return (
    <>
        <Graphics draw={draw} />
    </>
  )
}

export default LeftWall