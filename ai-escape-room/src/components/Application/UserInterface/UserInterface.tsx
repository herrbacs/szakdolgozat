import React from 'react'
import { Navigation } from './Navigation'
import ToggleInventory from './ToggleInventory'
import Map from './Map'

const UserInterface = () => {
  return (
    <>
      <Navigation />
      <ToggleInventory />
      <Map />
    </>
  )
}

export default UserInterface