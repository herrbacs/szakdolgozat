import { useContext, useEffect, useState } from 'react'
import { Wall } from './Wall'
import { AppSettingsContext } from '../context/AppSettingsContext'
import { Text } from '@pixi/react'
import Exit from './Exit'
import Ceiling from './Ceiling'
import Floor from './Floor'
import LeftWall from './LeftWall'
import RightWall from './RightWall'
import Pickable from './Pickable'
import React from 'react'
import { AppSettingsContextType, Wall as WallType } from '../shared/types'

const Game = () => {
  const { appSettings: { levelInformation: { walls }, game : { currentWallIndex } } } : AppSettingsContextType = useContext(AppSettingsContext)
  const [currentWall, setCurrentWall] = useState<WallType | null>(null)

  useEffect(() => {
    console.log("Render Game component")
    setCurrentWall(walls[Math.abs(currentWallIndex)])
  }, [walls, currentWallIndex])

  return (
    <>
      {!!currentWall &&
        <Wall color={currentWall.color}>
          <Ceiling/>
          <LeftWall/>
          <Text x={150} y={150} text={`${Math.abs(currentWallIndex)} wall`} style={{ fontFamily: 'Arial', fontSize: 20 }}/>
          <RightWall/>
          <Floor/>
          {
            currentWall.exit && <Exit exit={currentWall?.exit} />
          }
          {
            currentWall.pickables.map((pickable) => <Pickable key={pickable.id} pickable={pickable}/>) 
          }
        </Wall>
      }  
    </>
  )
}

export default Game