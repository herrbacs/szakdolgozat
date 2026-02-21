import React, { useContext, useState } from 'react'
import { AppSettingsContext } from '../../context/AppSettingsContext'
import { SetAppSettingsActionEnum } from '../../shared/enums'
import { AppSettingsContextType } from '../../shared/types/frameworkTypes'
import { PickableObject } from '../../shared/types/gameObjectTypes'
import { CursorActions } from '../../shared/types/appTypes'
import { spriteUrl } from '../../shared/urls'

const Inventory = () => {
	const { 
    appSettings: {
     screenSettings: { dimension: { width } },
     gameInformation: { inventory, showInventory, selectedItem, cursorActions, levelId },
    },
    setAppSettings
  } : AppSettingsContextType = useContext(AppSettingsContext)

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const swipeStyle: React.CSSProperties = {
		height: '4.5rem',
		display: 'block',
		padding: '0 .6rem'
	}

  const inventorySlotStyle: React.CSSProperties = {
		width: '4.5rem',
    height: '4.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
	}

	const items = []
	for (let i = 0; i <= 10; i++) {
		if (inventory[i] == undefined) {
			items.push((
				<div key={i} style={{ backgroundColor: '#ffffff', width: '4.5rem', height: '4.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center'}}></div>
			))
			continue
		}

		items.push((
      <div
        key={i}
        style={{
          ...inventorySlotStyle,
          backgroundColor:
            selectedItem?.id === inventory[i].id
              ? (hoveredIndex === i ? '#ffe066' : '#ffec99')
              : (hoveredIndex === i ? '#d3d3d3' : '#ffffff')
        }}
        onContextMenu={(e) => openCursorActions(e, inventory[i])}
        onMouseEnter={() => setHoveredIndex(i)}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <img src={spriteUrl(levelId, inventory[i].id)} style={{ width: '3rem', height: 'auto' }}/>
      </div>
		))
	}

  const selectItem = (item: PickableObject) => 
    selectedItem?.id == item.id
      ? setAppSettings({ action: SetAppSettingsActionEnum.UNSELECT_ITEM })
      : setAppSettings({ action: SetAppSettingsActionEnum.SELECT_ITEM, payload: item })

  const openCursorActions = (event: React.MouseEvent<HTMLDivElement>, item: PickableObject) => {
    const position = cursorActions.position === null
      ? { x: event.clientX, y: event.clientY }
      : null
    const payload: CursorActions = {
      position,
      examine: { ...item.inspectionData, id: item.id },
      use: { action: () => selectItem(item) },
      take: null,
      search: null,
    }

    setAppSettings({ action: SetAppSettingsActionEnum.SET_CURSOR_ACTIONS, payload })
  }

  return (
		<div style={{transition: 'transform 1s ease-out', display: 'flex', position: 'absolute', bottom: '0', transform: showInventory ? 'none' : 'translateY(100%)', width: `${width}px`, backgroundColor: '#8f8f8f', padding: '.5rem 0' }}>
			<div style={swipeStyle}>
				<div style={{ margin: '0 auto', width: '2rem', height: '4.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
					<svg style={{display: 'block', maxHeight: '100%', maxWidth: '100%'}} viewBox="3.433 4.327 101.769 99.833" width="101.769" height="99.833" xmlns="http://www.w3.org/2000/svg">
						<path style={{stroke: 'rgb(0, 0, 0)', strokeWidth: '2px', paintOrder: 'stroke', strokeOpacity: '0', fill: 'rgb(255, 255, 255)'}} d="M 104.539 4.769 L 3.433 48.993 L 105.201 104.16 C 74.502 67.268 73.668 34.506 105.202 4.327 L 104.539 4.769 Z" transform="matrix(0.9999999999999999, 0, 0, 0.9999999999999999, -1.4210854715202004e-14, 0)"/>
					</svg>
				</div>
			</div>
			<div style={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
				{
					items.map(item => item)
				}
			</div>
			<div style={swipeStyle}>
				<div style={{ margin: '0 auto', width: '2rem', height: '4.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
					<svg style={{rotate: '180deg', display: 'block', maxHeight: '100%', maxWidth: '100%'}} viewBox="3.433 4.327 101.769 99.833" width="101.769" height="99.833" xmlns="http://www.w3.org/2000/svg">
						<path style={{stroke: 'rgb(0, 0, 0)', strokeWidth: '2px', paintOrder: 'stroke', strokeOpacity: '0', fill: 'rgb(255, 255, 255)'}} d="M 104.539 4.769 L 3.433 48.993 L 105.201 104.16 C 74.502 67.268 73.668 34.506 105.202 4.327 L 104.539 4.769 Z" transform="matrix(0.9999999999999999, 0, 0, 0.9999999999999999, -1.4210854715202004e-14, 0)"/>
					</svg>
				</div>
			</div>
		</div>
  )
}

export default Inventory