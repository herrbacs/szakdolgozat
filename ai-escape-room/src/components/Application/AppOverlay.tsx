import React from 'react'
import Inventory from './Inventory'
import ToggleInventory from './ToggleInventory'
import InspectModal from '../GameObjects/Inspectable/InspectModal'

const AppOverlay = () => {
  return (
    <>
      <Inventory/>
      <InspectModal/>
    </>
  )
}

export default AppOverlay