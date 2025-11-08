/* eslint-disable react/prop-types */
import { Sprite } from '@pixi/react'
import { useCallback, useContext, useEffect, useState } from 'react'
import { AppSettingsContext } from '../../context/AppSettingsContext'
import React from 'react'
import { base64ToBlob } from '../../shared/helper'
import { SetAppSettingsActionEnum } from '../../shared/enums'
import { AppSettingsContextType } from '../../shared/types/frameworkTypes'
import { ExitObject } from '../../shared/types/gameObjectTypes'

// TODO API a végső ajtó méretet ha detektálja, ki lehet számolni hogy mekkora újra méretezésre van szükség
const Exit = ({ exit: { sprites, keeyId, state } }: { exit: ExitObject }) => {
  const [closedExitImg, setClosedExitImg] = useState<string | undefined>(undefined)
  const [openedExitImg, setOpenedExitImg] = useState<string | undefined>(undefined)

  const scale = 0.7
  const { appSettings: { screenSettings: { dimension: { width, height }, perspective }, gameInformation: { selectedItem } }, setAppSettings} : AppSettingsContextType = useContext(AppSettingsContext)

  const calculateYPosition = () => {
    const wallHeight = (height - 2 * perspective)
    return perspective + wallHeight - (sprites[0].dimension.height * scale)
  }
  
  const calculateXPosition = () => {
    return perspective + ((width - (perspective * 2)) / 2) - ((sprites[0].dimension.width * scale) / 2)
  }

  const tryOpen = useCallback(() => {
      if(selectedItem?.id !== keeyId) {
        return
      }

      setAppSettings({ action: SetAppSettingsActionEnum.DESTROY_INVENTORY_ITEM, payload: selectedItem })
      setAppSettings({ action: SetAppSettingsActionEnum.EXIT })

      console.log('YOU HAVE ESCAPED')
    }, [selectedItem]
  )

  useEffect(() => {
    const closed = sprites.find(s => s.state === ExitStates.CLOSED)
    const open = sprites.find(s => s.state === ExitStates.OPEN)

    if (!closed || !open) {
      throw 'Failed To Load Exit Sprites'
    }

    setClosedExitImg(URL.createObjectURL(base64ToBlob(closed.blob, 'image/png')))
    setOpenedExitImg(URL.createObjectURL(base64ToBlob(open.blob, 'image/png')))
  }, [sprites])

  return (
   <>
   { closedExitImg && openedExitImg &&
    <Sprite
        interactive
        onmousedown={tryOpen}
        image={state == ExitStates.OPEN ? openedExitImg : closedExitImg}
        scale={{ x: scale, y: scale }}
        x={calculateXPosition()}
        y={calculateYPosition()}
    />
   }
   </>
  )
}

export default Exit;
