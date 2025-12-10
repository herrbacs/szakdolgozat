import React from 'react'
import Inventory from './Inventory'
import InspectModal from '../GameObjects/Inspectable/InspectModal'
import LockModal from './LockModal'

const AppOverlay = () => {
  return (
    <>
      <Inventory/>
      <InspectModal/>
      <LockModal/>
    </>
  )
}

export default AppOverlay