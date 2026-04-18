import React, { useContext } from 'react'
import BaseModal from '../../HtmlComponents/BaseModal'
import { AppSettingsContextType } from '../../../../shared/types/frameworkTypes'
import { AppSettingsContext } from '../../../../context/AppSettingsContext'
import { SetAppSettingsActionEnum } from '../../../../shared/enums'
import { spriteUrl } from '../../../../shared/urls'

const InspectModal = () => {
  const {
    appSettings: {
      gameInformation: { InspectingModal, levelId }
    },
    setAppSettings
  }: AppSettingsContextType = useContext(AppSettingsContext)

  if (!InspectingModal) {
    return
  }

  return InspectingModal && (
    <BaseModal
      title={InspectingModal.appellation}
      onClose={() => setAppSettings({ action: SetAppSettingsActionEnum.TOGGLE_OBJECT_INSPECTING, payload: null })}
    >
      <div className="flex w-full flex-col items-center justify-center gap-5 px-6 pb-8 pt-6">
        <div className="flex w-full justify-center rounded-3xl bg-gradient-to-br from-slate-50 to-indigo-50 px-6 py-6 ring-1 ring-slate-200">
          <img src={spriteUrl(levelId, InspectingModal.id)} style={{ width: '15rem', height: 'auto' }} />
        </div>
        <div className="flex max-h-[40vh] w-full justify-center overflow-auto rounded-2xl bg-slate-50 px-5 py-5 text-lg leading-8 text-slate-600 ring-1 ring-slate-200">
          <p style={{ wordBreak: 'break-word', textAlign: 'center' }}>{InspectingModal.information}</p>
        </div>
      </div>
    </BaseModal>
  )
}

export default InspectModal
