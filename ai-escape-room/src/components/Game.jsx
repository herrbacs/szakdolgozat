import { useContext, useEffect, useState } from 'react'
import { Wall } from './Wall'
import { AppSettingsContext } from '../context/AppSettingsContext'
import { Text } from '@pixi/react'
import { Exit } from './Exit'
import Ceiling from './Ceiling'
import Floor from './Floor'
import LeftWall from './LeftWall'
import RightWall from './RightWall'
import Pickable from './Pickable'

const Game = () => {
  const { appSettings } = useContext(AppSettingsContext)
  const [currentWall, setCurrentWall] = useState(null)
  
  useEffect(() => {
    setCurrentWall(appSettings.levelInformation.walls[Math.abs(appSettings.game.currentWallIndex)])
  }, [appSettings.game, appSettings.levelInformation.walls])
  

  const renderObjects = ([key, value], x) => {
    switch (key) {
      case 'exit': 
        return <Exit key={x} exit={value}/>    
      case 'pickables': 
        return value.map((pickable, i) => <Pickable key={i} pickable={pickable}/>)    
      default:
        break
    }
  }

  return (
    <>
      {!!currentWall &&
        <Wall color={currentWall.color}>
          <Ceiling/>
          <LeftWall/>
        <Text
          x={150}
          y={150}
          text={`${Math.abs(appSettings.game.currentWallIndex)} wall`}
          style={{ fontFamily: 'Arial', fontSize: 20 }}
          />
          <RightWall/>
          <Floor/>
          {
            // Draw Current Wall
            Object.entries(currentWall.objects).map(renderObjects)
          }
      </Wall>
      }  
    </>
  )
}

export default Game