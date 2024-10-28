import React, { useContext } from 'react'
import { AppStoreState } from '../shared/types'
import { AppSettingsContext } from '../context/AppSettingsContext'
import { SetAppSettingsAction } from '../shared/enums'

const ToggleInventory = () => {
  const { appSettings: { gameInformation: { currentWall } }, setAppSettings } : { appSettings: AppStoreState, setAppSettings: any } = useContext(AppSettingsContext)

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
    <div style={containerStyle} onClick={() => { setAppSettings({ action: SetAppSettingsAction.TOGGLE_INVENTORY }) }}>
			<span style={{fontWeight: 'bold', fontSize: '2rem', color: '#ffec99'}}>I</span>
		</div>
  )
}

export default ToggleInventory