/* eslint-disable react/prop-types */
import { Sprite } from '@pixi/react'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { AppSettingsContext } from '../context/AppSettingsContext'
import { AppSettingsContextType, ExitObject } from '../shared/types'
import { ExitStates } from '../shared/enums'
import React from 'react'

// TODO API a végső ajtó méretet ha detektálja, ki lehet számolni hogy mekkora újra méretezésre van szükség
const Exit = ({ exit: { sprites } }: { exit: ExitObject }) => {
  const [closedExitImg, setClosedExitImg] = useState<string | null>(null)
  const [openedExitImg, setOpenedExitImg] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  const scale = 0.7
  const { appSettings: { screenSettings: { width, height, perspective } } } : AppSettingsContextType = useContext(AppSettingsContext)

  const calculateYPosition = () => {
    const wallHeight = (height - 2 * perspective)
    return perspective + wallHeight - (sprites[0].height * scale)
  }

  const calculateXPosition = () => {
    return perspective + ((width - (perspective * 2)) / 2) - ((sprites[0].width * scale) / 2)
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

      if (sprite.state === ExitStates.CLOSED) {
        setClosedExitImg(URL.createObjectURL(blob))
        return
      }
      
      setOpenedExitImg(URL.createObjectURL(blob))
    })
  }

  const tryOpen = useCallback(
    () => {
      console.log('YOU HAVE ESCAPED')
      setOpen(true)
    },
    [],
  )

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

export default Exit;
