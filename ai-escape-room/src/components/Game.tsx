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
import Pickable from './GameObjects/Pickable'
import Inspectable from './GameObjects/Inspectable/Inspectable'
import Interactable from './GameObjects/Interactable/Interactable'

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
          {
            currentWall.inspectables.map((inspectable) => <Inspectable key={inspectable.id} inspectable={inspectable}/>) 
          }
          {
            currentWall.interactables.map((interactable) => <Interactable key={interactable.id} interactable={interactable}/>) 
          }
        </Wall>
      }  
    </>
  )
}

export default Game