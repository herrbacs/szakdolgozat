import React from 'react'
import { Navigation } from './Navigation'
import ToggleInventory from './ToggleInventory'
import Map from './Map'
import Notepad from './NotePad'

const UserInterface = () => {
  return (
    <>
      <Navigation />
      <ToggleInventory />
      <Map />
      <Notepad />
    </>
  )
}

export default UserInterface