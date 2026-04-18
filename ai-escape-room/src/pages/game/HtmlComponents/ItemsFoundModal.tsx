import React, { useContext, useState } from 'react'
import BaseModal from './BaseModal'
import { AppSettingsContextType } from '../../../shared/types/frameworkTypes'
import { AppSettingsContext } from '../../../context/AppSettingsContext'
import { SetAppSettingsActionEnum } from '../../../shared/enums'
import { spriteUrl } from '../../../shared/urls'

const ItemsFoundModal = () => {
  const { appSettings: {
    gameInformation: { itemsFoundModal, levelId }
  }, setAppSettings }: AppSettingsContextType = useContext(AppSettingsContext)

  const [currentItemIndex, setCurrentItemIndex] = useState<number>(0)

  const closeModal = () => {
    setCurrentItemIndex(0)
    setAppSettings({ action: SetAppSettingsActionEnum.TAKE_FOUND_ITEMS })
    setAppSettings({ action: SetAppSettingsActionEnum.EMPTY_FOUD_ITEMS_MODAL, payload: null })
  }

  const isFirstElement = currentItemIndex === 0
  const isLastElement = currentItemIndex === itemsFoundModal?.length! - 1

  if (itemsFoundModal === null) {
    return
  }

  if (itemsFoundModal.length > 0) {
    return (
      <BaseModal
        title={itemsFoundModal[currentItemIndex].object.inspectionData.appellation}
        onClose={closeModal}
      >
        <>
          <div className="flex w-full flex-col items-center justify-center gap-5 px-6 pb-6 pt-5">
            <div className="flex w-full justify-center rounded-3xl bg-gradient-to-br from-slate-50 to-indigo-50 px-6 py-6 ring-1 ring-slate-200">
              <img
                src={spriteUrl(levelId, itemsFoundModal[currentItemIndex].object.id)}
                style={{ width: '15rem', height: 'auto' }}
              />
            </div>
            <div className="flex w-full max-w-2xl justify-center rounded-2xl bg-white px-5 py-5 text-lg text-slate-600 ring-1 ring-slate-200">
              <p style={{ wordBreak: 'break-word', textAlign: 'center' }}>
                {itemsFoundModal[currentItemIndex].object.inspectionData.information}
              </p>
            </div>
          </div>
          <div className="flex w-full items-center justify-between px-6 pb-6">
            {!isFirstElement ? (
              <button
                onClick={() => setCurrentItemIndex(currentItemIndex - 1)}
                className="rounded-xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-200"
              >
                Previous
              </button>
            ) : (
              <div />
            )}
            {!isLastElement && (
              <button
                onClick={() => setCurrentItemIndex(currentItemIndex + 1)}
                className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
              >
                Next
              </button>
            )}
          </div>
        </>
      </BaseModal>
    )
  }

  return (
    <BaseModal
      title=''
      onClose={() => setAppSettings({ action: SetAppSettingsActionEnum.EMPTY_FOUD_ITEMS_MODAL, payload: null })}
    >
      <div className="flex w-full flex-col items-center justify-center px-6 py-10">
        <div className="rounded-2xl bg-slate-50 px-8 py-8 text-center ring-1 ring-slate-200">
          <h1 className="text-3xl font-semibold text-slate-700">It Is Empty</h1>
        </div>
      </div>
    </BaseModal>
  )
}

export default ItemsFoundModal
