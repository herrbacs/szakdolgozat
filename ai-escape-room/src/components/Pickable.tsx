/* eslint-disable react/prop-types */
import { Sprite } from '@pixi/react'
import { useContext, useEffect, useState } from 'react'
import { AppSettingsContext } from '../context/AppSettingsContext'
import { setPositionOn } from '../shared/positionCalculator'
import { GameDisplayAreas } from '../shared/enums'
import { AppSettingsContextType, Coordinate, PickableObject } from '../shared/types'
import React from 'react'

const Pickable = ({ pickable: {id, position, name, sprite} }: { pickable: PickableObject }) => {
	const scale = 0.1
	const { appSettings: { screenSettings } } : AppSettingsContextType = useContext(AppSettingsContext)
	const [pickedUp, setPickedUp] = useState<Boolean>(false)
  const [pickableSpirte, setPickableSpirte] = useState<string>('')
	const [spriteCoordinate, setSpriteCoordinate] = useState<Coordinate>({} as Coordinate)
  
  const handlePickUp = () => {
		setPickedUp(true)
  }

  useEffect(() => {
    async function fetchMyAPI() {
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
      setPickableSpirte(URL.createObjectURL(blob))
    }

    fetchMyAPI()
    setSpriteCoordinate(setPositionOn({ area: GameDisplayAreas.FT2, screenSettings, sprite, scale }))
  }, [])

  return (
		<>
			{
				!!pickableSpirte &&
        !pickedUp &&
				<Sprite
					interactive
					onmousedown={handlePickUp}
					image={pickableSpirte}
					scale={{ x: scale, y: scale }}
					x={spriteCoordinate.X}
					y={spriteCoordinate.Y}
					anchor={[0.5, 0.5]}
					rotation={Math.floor(Math.random() * 10)}
				/>
			}
		</>
  )
}

export default Pickable