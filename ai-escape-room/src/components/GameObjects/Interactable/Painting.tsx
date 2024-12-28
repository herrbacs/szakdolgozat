import React, { useContext, useState } from "react"
import { Sprite } from "@pixi/react"
import { SetAppSettingsAction } from "../../../shared/enums"
import { AppSettingsContextType, Coordinate, InteractableObject } from "../../../shared/types"
import { AppSettingsContext } from "../../../context/AppSettingsContext"
import Pickable from "../Pickable"
import Inspectable from "../Inspectable/Inspectable"

type PaintingComponentType = {
	interactable: InteractableObject,
	image: string,
	scale: number,
	coordinate: Coordinate
}

const Painting = ({ interactable, image, scale, coordinate }: PaintingComponentType) => {
  const { setAppSettings }: AppSettingsContextType = useContext(AppSettingsContext)
  const [destroyed, setDestroyed] = useState<boolean>(false)

	const handleInteraction = () => {
		setAppSettings({ action: SetAppSettingsAction.DESTROY_PAINTING , payload: interactable })
		setDestroyed(true)
	}

  return (
    <>
      { interactable.holds.inspectable && 
        <Inspectable 
          inspectable={interactable.holds.inspectable} 
          parentInfo={{}}
        />
      }
      {!destroyed && 
        <Sprite
          onclick={handleInteraction}
          interactive
          image={image}
          scale={{ x: scale, y: scale }}
          x={coordinate.X}
          y={coordinate.Y}
          anchor={[0.5, 0.5]}
        />
      }
      {/* { interactable.holds.pickable && <Pickable /> } */}
    </>
  )
}

export default Painting
