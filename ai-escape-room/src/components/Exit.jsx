/* eslint-disable react/prop-types */
import { Sprite } from '@pixi/react'
import { useContext, useEffect, useState } from 'react'
import { AppSettingsContext } from '../context/AppSettingsContext'

// TODO API a végső ajtó méretet ha detektálja, ki lehet számolni hogy mekkora újra méretezésre van szükség
export const Exit = ({ exit: { sprites } }) => {
  const [closedExitImg, setClosedExitImg] = useState(null)
  const [openedExitImg, setOpenedExitImg] = useState(null)
  const [open, setOpen] = useState(false)
 
  const scale = 0.7
  const { appSettings } = useContext(AppSettingsContext)

  const calculateYPosition = () => {
    return ((appSettings.screen.height / 3))
  }

  const calculateXPosition = () => {
    return ((appSettings.screen.width / 2))
  }

  const getExitImages = async () => {
    sprites.forEach(async (sprite) => {
      // TODO Get images on game start
      let response = await fetch(`http://localhost:5000/images/${sprite.name}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        console.error(response)
        return
      }

      const blob = await response.blob();

      if (sprite.state === "CLOSED") {
        setClosedExitImg(URL.createObjectURL(blob))
        return
      }

      setOpenedExitImg(URL.createObjectURL(blob))
    })
  }

  const tryOpen = () => {
    console.log('YOU HAVE ESCAPED')
    setOpen(true)
  }

  useEffect(() => {
    async function fetchMyAPI() {
      await getExitImages()
    }

    fetchMyAPI()
  }, [])

  return (
   <>
   {
    closedExitImg !== null &&
    openedExitImg !== null &&
    <Sprite
        interactive
        onmousedown={tryOpen}
        image={open ? openedExitImg : closedExitImg}
        scale={{ x: scale, y: scale }}
        x={calculateXPosition()}
        y={calculateYPosition()}
    />
   }
   </>
  )
}
