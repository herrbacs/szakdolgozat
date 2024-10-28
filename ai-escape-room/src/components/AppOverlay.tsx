import React from 'react'
import Inventory from './Inventory'
import ToggleInventory from './ToggleInventory'

const AppOverlay = () => {
  return (
    <>
        <ToggleInventory/>
        <Inventory/>
    </>
  )
}

export default AppOverlay