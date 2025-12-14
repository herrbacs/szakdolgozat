import React from 'react'
import Inventory from './Inventory'
import InspectModal from '../GameObjects/Inspectable/InspectModal'
import LockModal from './LockModal'
import ItemsFoundModal from './ItemsFoundModal'
import CursorActions from './CursorActions'

const AppOverlay = () => {
  return (
    <>
      <Inventory/>
      <InspectModal/>
      <LockModal/>
      <ItemsFoundModal/>
      <CursorActions />
    </>
  )
}

export default AppOverlay