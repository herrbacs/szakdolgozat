import { useContext } from 'react'
import { Wall } from './RoomStructures/Wall'
import { AppSettingsContext } from '../context/AppSettingsContext'
import Exit from './GameObjects/Exit'
import Ceiling from './RoomStructures/Ceiling'
import Floor from './RoomStructures/Floor'
import LeftWall from './RoomStructures/LeftWall'
import RightWall from './RoomStructures/RightWall'
import React from 'react'
import Pickable from './GameObjects/Pickable'
import Inspectable from './GameObjects/Inspectable/Inspectable'
import Interactable from './GameObjects/Interactable/Interactable'
import { AppSettingsContextType } from '../shared/types/frameworkTypes'

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
          {/* {
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
          } */}
        </Wall>
      }  
    </>
  )
}

export default Game