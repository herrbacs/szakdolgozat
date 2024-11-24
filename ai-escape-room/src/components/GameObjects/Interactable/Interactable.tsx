import React, { useContext, useEffect, useState } from 'react'
import { Sprite } from '@pixi/react'
import { InteractableObjectSpriteStates, SetAppSettingsAction } from '../../../shared/enums'
import { AppSettingsContextType, Coordinate, InteractableObject } from '../../../shared/types'
import { AppSettingsContext } from '../../../context/AppSettingsContext'
import { base64ToBlob } from '../../../shared/helper'
import { setPositionOn } from '../../../shared/positionCalculator'

const Interactable = ({ interactable, rightPerspective = false, leftPerspective = false }: { interactable: InteractableObject, rightPerspective?: boolean, leftPerspective?: boolean }) => {
	const { appSettings: { screenSettings }, setAppSettings} : AppSettingsContextType = useContext(AppSettingsContext)
	const [spriteCoordinate, setSpriteCoordinate] = useState<Coordinate>({} as Coordinate)
	const [interactableSpirte, setInteractableSpirte] = useState<string>('')
	const [destroyed, setDestroyed] = useState<boolean>(false)
	// const scale = calculateScaleFactorOfInspectableObject(inspectable)
	const scale = .15

  useEffect(() => {
		console.log("Render interactable")
		let sprite = interactable.sprites.find(sprite => sprite.state === InteractableObjectSpriteStates.DEFAULT)
	
		if (sprite === undefined) {
			throw Error(`Failed to load the DEFAULT sprite of an inspectable object #${interactable.id}`)
		}

		
		if (rightPerspective) {
			sprite = sprite.perspective!.right
		}
		if (leftPerspective) {
			sprite = sprite.perspective!.left
		}
	
			setInteractableSpirte(URL.createObjectURL(base64ToBlob(sprite.blob, 'image/png')))
			setSpriteCoordinate(setPositionOn({ 
			area: interactable.position,
			screenSettings,
			sprite,
			scale,
			perspective: rightPerspective || leftPerspective 
		}))
	}, [interactable])

	const handleInteraction = () => {
		setAppSettings({ action: SetAppSettingsAction.DESTROY_PAINTING , payload: interactable })
		setDestroyed(true)
	}

  return (
		<>
			{
				interactableSpirte && !destroyed && 
				<Sprite
					onclick={handleInteraction}
					interactive
					image={interactableSpirte}
					scale={{ x: scale, y: scale }}
					x={spriteCoordinate.X}
					y={spriteCoordinate.Y}
					anchor={[0.5, 0.5]}
				/>
			}
		</>
  )
}

export default Interactable