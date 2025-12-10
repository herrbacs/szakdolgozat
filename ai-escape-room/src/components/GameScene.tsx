import { useContext } from 'react'
import FrontWall from './RoomStructures/FrontWall'
import { AppSettingsContext } from '../context/AppSettingsContext'
import Exit from './GameObjects/Exit'
import Ceiling from './RoomStructures/Ceiling'
import Floor from './RoomStructures/Floor'
import LeftWall from './RoomStructures/LeftWall'
import RightWall from './RoomStructures/RightWall'
import React from 'react'
import Pickable from './GameObjects/Pickable'
import Inspectable from './GameObjects/Inspectable/Inspectable'
import { AppSettingsContextType } from '../shared/types/frameworkTypes'
import MovableCover from './GameObjects/MovableCover/MovableCover'

const GameScene = () => {
  const { appSettings: { gameInformation: { currentWall } } }: AppSettingsContextType = useContext(AppSettingsContext)

  return (
    <>
      {currentWall &&
        <FrontWall color={currentWall.color}>
          <Ceiling />
          <LeftWall />
          <RightWall />
          <Floor />
          {currentWall.exit && <Exit exit={currentWall?.exit} />}
          {currentWall.pickables.map((pickable) => <Pickable key={pickable.id} pickable={pickable}/>)}
          {currentWall.inspectables.map((inspectable) => <Inspectable key={inspectable.id} inspectable={inspectable}/>)}
          {currentWall.movableCovers.map((movableCover) => <MovableCover key={movableCover.id} movableCover={movableCover}/>)}
        </FrontWall>
      }
    </>
  )
}

export default GameScene