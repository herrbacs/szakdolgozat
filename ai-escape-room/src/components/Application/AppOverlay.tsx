import React from 'react'
import Inventory from './Inventory'
import InspectModal from '../GameObjects/Inspectable/InspectModal'
import LockModal from './LockModal'
import ItemsFoundModal from './ItemsFoundModal'

const AppOverlay = () => {
  return (
    <>
      <Inventory/>
      <InspectModal/>
      <LockModal/>
      <ItemsFoundModal/>
    </>
  )
}

export default AppOverlay