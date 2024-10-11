import { useContext, useState } from 'react'
import { Wall } from './Wall'
import { AppSettingsContext } from '../context/AppSettingsContext'
import { Text } from '@pixi/react'
import { Exit } from './Exit'
import Ceiling from './Ceiling'

const Game = () => {
  const { appSettings } = useContext(AppSettingsContext)
  const currentWall = appSettings.levelInformation.walls[Math.abs(appSettings.game.currentWall)]

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
        <Wall color={currentWall.color}>
          <Text
            x={appSettings.screen.width / 2}
            y={50}
            text={`${Math.abs(appSettings.game.currentWall)} wall`}
            style={{ fontFamily: 'Arial', fontSize: 30 }}
          />

          {
            // Draw Ceiling
            <Ceiling></Ceiling>
          }
          {
            // Draw Current Wall
            Object.entries(currentWall.objects).map(renderObjects)
          }
        </Wall>
        
    </>
  )
}

export default Game