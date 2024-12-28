import React, { ReactNode, useContext, useEffect, useState } from 'react'
import { Sprite } from '@pixi/react'
import { InteractableObjectSpriteStates, InteractableObjectTypes, SetAppSettingsAction } from '../../../shared/enums'
import { AppSettingsContextType, Coordinate, InteractableObject } from '../../../shared/types'
import { AppSettingsContext } from '../../../context/AppSettingsContext'
import { base64ToBlob, calculateScaleFactorOfInteractableObject } from '../../../shared/helper'
import { setPositionOn } from '../../../shared/positionCalculator'
import Painting from './Painting'

type InteractableComponentType = {
	children?: ReactNode,
	interactable: InteractableObject,
	rightPerspective?: boolean,
	leftPerspective?: boolean
}

const Interactable = ({ interactable, rightPerspective = false, leftPerspective = false }: InteractableComponentType) => {
	const { appSettings: { screenSettings } } : AppSettingsContextType = useContext(AppSettingsContext)
	const [spriteCoordinate, setSpriteCoordinate] = useState<Coordinate>({} as Coordinate)
	const [interactableSpirte, setInteractableSpirte] = useState<string>('')
	const scale: number = calculateScaleFactorOfInteractableObject(interactable)

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

	const getInteractableComponentByType = () => {
		switch (interactable.type) {
			case InteractableObjectTypes.PAINTING:
				return <Painting interactable={interactable} image={interactableSpirte} scale={scale} coordinate={spriteCoordinate}/>
			default: return;
		}
	}

  return (
		<>
			{
				interactableSpirte && getInteractableComponentByType()
			}
		</>
  )
}

export default Interactable