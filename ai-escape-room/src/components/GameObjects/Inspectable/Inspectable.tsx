import React, { useContext, useEffect, useState } from 'react'
import { AppSettingsContextType, Coordinate, InspectableObject } from '../../../shared/types'
import { AppSettingsContext } from '../../../context/AppSettingsContext'
import { base64ToBlob, calculateScaleFactorOfInspectableObject } from '../../../shared/helper'
import { InspectableObjectSpriteStates } from '../../../shared/enums'
import { setPositionOn } from '../../../shared/positionCalculator'
import { Sprite } from '@pixi/react'

const Inspectable = ({ inspectable }: { inspectable: InspectableObject }) => {
	const { appSettings: { screenSettings } } : AppSettingsContextType = useContext(AppSettingsContext)
	const [spriteCoordinate, setSpriteCoordinate] = useState<Coordinate>({} as Coordinate)
	const [inspectableSpirte, setInspectableSpirte] = useState<string>('')
	const scale = calculateScaleFactorOfInspectableObject(inspectable)

  useEffect(() => {
    const sprite = inspectable.sprites.find(sprite => sprite.state === InspectableObjectSpriteStates.DEFAULT)

    if (sprite === undefined) {
      throw Error(`Failed to load the DEFAULT sprite of an inspectable object #${inspectable.id}`)
    }

    setInspectableSpirte(URL.createObjectURL(base64ToBlob(sprite.blob, 'image/png')))
    setSpriteCoordinate(setPositionOn({ area: inspectable.position, screenSettings, sprite, scale }))
  }, [])

  return (
		<>
			{
				inspectableSpirte &&
				<Sprite
					interactive
					image={inspectableSpirte}
					scale={{ x: scale, y: scale }}
					x={spriteCoordinate.X}
					y={spriteCoordinate.Y}
					anchor={[0.5, 0.5]}
				/>
			}
		</>
  )
}

export default Inspectable