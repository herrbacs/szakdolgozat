import React, { useContext } from 'react'
import { AppSettingsContext } from '../../context/AppSettingsContext'
import { AppSettingsContextType } from '../../shared/types/frameworkTypes'
import { SetAppSettingsActionEnum } from '../../shared/enums'

const ToggleInventory = () => {
  const { appSettings: { gameInformation: { currentWall } }, setAppSettings } : AppSettingsContextType = useContext(AppSettingsContext)

	const containerStyle: React.CSSProperties  = {position: 'absolute',
		top: 0,
		right: 0,
		backgroundColor: '#c2c2c2',
		padding: '1rem',
		margin: '1rem',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		width: '2rem',
		height: '2rem',
		 borderRadius: '50%',
		cursor: 'pointer',
		border: '2px solid #FFFF'
	}

  return (
    <div style={containerStyle} onClick={() => { setAppSettings({ action: SetAppSettingsActionEnum.TOGGLE_INVENTORY }) }}>
			<span style={{fontWeight: 'bold', fontSize: '2rem', color: '#ffec99'}}>I</span>
		</div>
  )
}

export default ToggleInventory