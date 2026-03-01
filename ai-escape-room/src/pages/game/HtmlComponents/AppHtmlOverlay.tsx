import React from 'react'
import Inventory from './Inventory'
import InspectModal from '../GameObjects/Inspectable/InspectModal'
import LockModal from './LockModal'
import ItemsFoundModal from './ItemsFoundModal'
import CursorActions from '../Application/UserInterface/CursorActions'
import NotepadModal from './NotepadModal'
import GameMenuModal from './GameMenuModal'
import LevelCompleteModal from './LevelCompleteModal'
import HamburgerMenu from '../Application/UserInterface/HamburgerMenu'

const AppHtmlOverlay = () => {
  return (
    <>
      <HamburgerMenu />
      <GameMenuModal />
      <LevelCompleteModal />
      <Inventory/>
      <InspectModal/>
      <LockModal/>
      <ItemsFoundModal/>
      <CursorActions />
      <NotepadModal />
    </>
  )
}

export default AppHtmlOverlay
