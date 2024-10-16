import { useContext, useEffect, useState } from 'react'
import { Wall } from './Wall'
import { AppSettingsContext } from '../context/AppSettingsContext'
import { Text } from '@pixi/react'
import { Exit } from './Exit'
import Ceiling from './Ceiling'
import Floor from './Floor'
import LeftWall from './LeftWall'
import RightWall from './RightWall'

const Game = () => {
  const { appSettings } = useContext(AppSettingsContext)
  const [currentWall, setCurrentWall] = useState(null)
  
  useEffect(() => {
    setCurrentWall(appSettings.levelInformation.walls[Math.abs(appSettings.game.currentWallIndex)])
  }, [appSettings.game, appSettings.levelInformation.walls])
  

  const renderObjects = ([key, value], i) => {
    switch (key) {
      case 'exit': 
        return <Exit key={i} exit={value}/>    
      default:
        break
    }
  }

  return (
    <>
      {!!currentWall &&
        <Wall color={currentWall.color}>
        {
          // Draw Ceiling
          <Ceiling></Ceiling>
        }
        {
          // Draw Left Wall
          <LeftWall></LeftWall>
        }
        {
          // Draw Current Wall
          Object.entries(currentWall.objects).map(renderObjects)
        }
        <Text
          x={150}
          y={150}
          text={`${Math.abs(appSettings.game.currentWallIndex)} wall`}
          style={{ fontFamily: 'Arial', fontSize: 20 }}
        />
        {
          // Draw Right Wall
          <RightWall></RightWall>
        }
        {
          // Draw Floor
          <Floor></Floor>
        }
      </Wall>
      }  
    </>
  )
}

export default Game