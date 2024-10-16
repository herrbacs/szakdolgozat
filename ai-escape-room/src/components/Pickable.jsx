/* eslint-disable react/prop-types */
import { Sprite } from '@pixi/react'
import { useContext, useEffect, useState } from 'react'
import { AppSettingsContext } from '../context/AppSettingsContext'

const Pickable = ({ pickable: {id, position, name, sprite} }) => {
	const scale = 0.1
	const { appSettings: { screen: { width, height, offset, offsetFloor } } } = useContext(AppSettingsContext)
	const [pickedUp, setPickedUp] = useState(false)
  const [pickableSpirte, setPickableSpirte] = useState(null)
  
  const handlePickUp = () => {
		setPickedUp(true)
  }

  const calculateYPosition = () => {
    return height - offset + offsetFloor
  }

  const calculateXPosition = () => {
    return offset + ((width - (offset * 2)) / 2) - ((sprite.width * scale) / 2)
  }

  useEffect(() => {
		console.log( id, position, name, sprite)
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
  }, [])

  return (
		<>
			{
				!!pickableSpirte && !pickedUp &&
				<Sprite
					interactive
					onmousedown={handlePickUp}
					image={pickableSpirte}
					scale={{ x: scale, y: scale }}
					x={calculateXPosition()}
					y={calculateYPosition()}
					anchor={[0.5, 0.5]}
					rotation={Math.floor(Math.random() * 10)}
				/>
			}
		</>
  )
}

export default Pickable