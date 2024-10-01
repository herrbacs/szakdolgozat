/* eslint-disable react/prop-types */
import { Sprite } from '@pixi/react'
import exitOpened from '../assets/Door_Opened.png'
import exitClosed from '../assets/Door_Closed.png'
import { useContext, useState } from 'react'
import { AppSettingsContext } from '../context/AppSettingsContext'


// TODO API a végső ajtó méretet ha detektálja, ki lehet számolni hogy mekkora újra méretezésre van szükség
export const Exit = ({ exit: {sprite} }) => {
  const [open, setOpen] = useState(false)
  const scale = 1.
  const { appSettings } = useContext(AppSettingsContext)

  const calculateYPosition = () => {
    return ((appSettings.screen.height / 3) - (appSettings.navigationIconDimension.height*scale)/2)
  }

  const calculateXPosition = () => {
    return ((appSettings.screen.width / 2) - (sprite.width*scale) / 2)
  }

  const tryOpen = () => {
    console.log('YOU HAVE ESCAPED')
    setOpen(true)
  }

  return (
   <>
    <Sprite
        interactive
        onmousedown={tryOpen}
        image={open ? exitOpened : exitClosed}
        scale={{ x: scale, y: scale }}
        x={calculateXPosition()}
        y={calculateYPosition()}
    />
   </>
  )
}
