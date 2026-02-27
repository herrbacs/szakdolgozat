import { useContext } from 'react'
import FrontWall from './RoomStructures/FrontWall'
import Exit from './GameObjects/Exit'
import Ceiling from './RoomStructures/Ceiling'
import Floor from './RoomStructures/Floor'
import LeftWall from './RoomStructures/LeftWall'
import RightWall from './RoomStructures/RightWall'
import React from 'react'
import Pickable from './GameObjects/Pickable'
import Inspectable from './GameObjects/Inspectable/Inspectable'
import MovableCover from './GameObjects/MovableCover/MovableCover'
import Container from './GameObjects/Container/Container'
import { AppSettingsContextType } from '../../shared/types/frameworkTypes'
import { AppSettingsContext } from '../../context/AppSettingsContext'

const GameScene = () => {
  const { appSettings: { gameInformation: { walls, indexes: { currentWall } } } }: AppSettingsContextType = useContext(AppSettingsContext)
  const wall = walls[currentWall]

  return wall && (
    <>
      <FrontWall color={wall.color} />
      <Ceiling />
      <LeftWall />
      <RightWall />
      <Floor />

      {wall.exit && <Exit exit={wall?.exit} />}
      {wall.pickables.map((pickable) => <Pickable key={pickable.id} pickable={pickable} />)}
      {wall.inspectables.map((inspectable) => <Inspectable key={inspectable.id} inspectable={inspectable} />)}
      {wall.movableCovers.map((movableCover) => <MovableCover key={movableCover.id} movableCover={movableCover} />)}
      {wall.containers.map((container) => <Container key={container.id} container={container} />)}
    </>
  )
}

export default GameScene