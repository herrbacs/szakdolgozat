import React, { useContext } from 'react'
import BaseModal from '../../HtmlComponents/BaseModal'
import { AppSettingsContextType } from '../../../../shared/types/frameworkTypes'
import { AppSettingsContext } from '../../../../context/AppSettingsContext'
import { SetAppSettingsActionEnum } from '../../../../shared/enums'
import { spriteUrl } from '../../../../shared/urls'

const InspectModal = () => {
  const {
    appSettings: {
      gameInformation: { inspectingModal, levelId}
    },
    setAppSettings
  }: AppSettingsContextType = useContext(AppSettingsContext)

  if (!inspectingModal) {
    return
  }
  
  return inspectingModal && (
    <BaseModal
      title={inspectingModal.appellation}
      onClose={() => setAppSettings({ action: SetAppSettingsActionEnum.TOGGLE_OBJECT_INSPECTING, payload: null })}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={spriteUrl(levelId, inspectingModal.id)} style={{ width: '15rem', height: 'auto' }}/>
        </div>
        <div style={{ width: '90%', maxHeight: '90%', overflow: 'auto', display: 'flex', fontSize: '1.3rem', color: '#ffec99', justifyContent: 'center' }}>
          <p style={{ wordBreak: 'break-word', textAlign: 'center' }}>{inspectingModal.information}</p>
        </div>
      </div>
    </BaseModal>
  )
}

export default InspectModal