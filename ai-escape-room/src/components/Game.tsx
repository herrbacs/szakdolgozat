import { useContext } from 'react'
import { Wall } from './Wall'
import { AppSettingsContext } from '../context/AppSettingsContext'
import Exit from './Exit'
import Ceiling from './Ceiling'
import Floor from './Floor'
import LeftWall from './LeftWall'
import RightWall from './RightWall'
import React from 'react'
import { AppSettingsContextType } from '../shared/types'
import Pickable from './Pickable'

const Game = () => {
  const { appSettings: { gameInformation: { currentWall } } } : AppSettingsContextType = useContext(AppSettingsContext)

  return (
    <>
      {currentWall &&
        <Wall color={currentWall.color}>
          <Ceiling/>
          <LeftWall/>
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