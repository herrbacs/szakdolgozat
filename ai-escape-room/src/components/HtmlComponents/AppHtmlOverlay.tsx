import React from 'react'
import Inventory from './Inventory'
import InspectModal from '../GameObjects/Inspectable/InspectModal'
import LockModal from './LockModal'
import ItemsFoundModal from './ItemsFoundModal'
import CursorActions from '../Application/UserInterface/CursorActions'
import NotepadModal from './NotepadModal'

const AppHtmlOverlay = () => {
  return (
    <>
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