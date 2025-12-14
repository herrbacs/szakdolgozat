import React, { useContext, useEffect, useState } from 'react'
import { AppSettingsContext } from '../../../context/AppSettingsContext'
import { AppSettingsContextType } from '../../../shared/types/frameworkTypes'
import { SetAppSettingsActionEnum } from '../../../shared/enums'

const InspectModal = () => {
	const { appSettings: { gameInformation: { inspectingModal } }, setAppSettings } : AppSettingsContextType = useContext(AppSettingsContext)

  return inspectingModal && (
      <div style={{ width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, .5)', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0 }}>
        <div style={{ backgroundColor: '#8f8f8f', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: '50%', maxWidth: '80%', maxHeight: '80%', borderRadius: '.5rem' }}>
          <div style={{ padding: '.5rem 0', display: 'flex', flexDirection: 'row', width: '100%', textTransform: 'uppercase', color: '#FFFF', fontWeight: 'bold' }}>
            <div style={{ marginLeft: '.5rem', marginRight: '.5rem', width: '100%', fontSize: '1.5rem', textAlign: 'center' }}>{inspectingModal?.appellation}</div>
            <div 
              onClick={() => setAppSettings({ action: SetAppSettingsActionEnum.TOGGLE_OBJECT_INSPECTING , payload: null })}
              style={{ marginLeft: '.5rem', marginRight: '.5rem', textAlign: 'center', cursor: 'pointer' }}
            >
              ✕
            </div>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%'}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <h1 style={{width: '90%'}}>🔍</h1>
            </div>
            <div style={{width: '90%', maxHeight: '90%', overflow: 'auto', display: 'flex', fontSize: '1.3rem', color: '#ffec99',justifyContent: 'center'}}>
              <p style={{wordBreak: 'break-word', textAlign: 'center'}}>{inspectingModal.information}</p>
            </div>
          </div>
      </div>
    </div>
  )
}

export default InspectModal