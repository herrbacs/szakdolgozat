import React, { useContext, useState } from 'react'
import { AppSettingsContext } from '../../context/AppSettingsContext'
import { AppSettingsContextType } from '../../shared/types/frameworkTypes'
import { GameObjectTypeEnum, SetAppSettingsActionEnum } from '../../shared/enums'
import BaseModal from './BaseModal'

const ItemsFoundModal = () => {
  const { appSettings: { gameInformation: { itemsFoundModal } }, setAppSettings }: AppSettingsContextType = useContext(AppSettingsContext)

  const [currentItemIndex, setCurrentItemIndex] = useState<number>(0)

  const renderIcon = () => {
    if (itemsFoundModal === null) {
      throw new Error('ItemsFoundModal is empty')
    }

    if (itemsFoundModal[currentItemIndex].type === GameObjectTypeEnum.PICKABLE) {
      return '⭐'
    } else if (itemsFoundModal[currentItemIndex].type === GameObjectTypeEnum.INSPECTABLE) {
      return '🔍'
    }
  }

  const closeModal = () => {
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
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <h1 style={{ width: '90%' }}>
                {renderIcon()}
              </h1>
            </div>
            <div style={{ width: '90%', display: 'flex', fontSize: '1.2rem', color: '#ffec99', justifyContent: 'center' }}>
              <p style={{ wordBreak: 'break-word', textAlign: 'center' }}>
                {itemsFoundModal[currentItemIndex].object.inspectionData.information}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-around' }}>
            {!isFirstElement && <button
              onClick={() => setCurrentItemIndex(currentItemIndex - 1)}
              style={{
                padding: '.5rem 2rem',
                fontSize: '1.1rem',
                color: '#333333',
                backgroundColor: '#ffec99',
                border: 'none',
                borderRadius: '.4rem',
                cursor: 'pointer',
                margin: '1rem auto .5rem .5rem'
              }}
            >
              {'<<<'}
            </button>}
            {!isLastElement && <button
              onClick={() => setCurrentItemIndex(currentItemIndex + 1)}
              disabled={isLastElement}
              style={{
                padding: '.5rem 2rem',
                fontSize: '1.1rem',
                color: '#333333',
                backgroundColor: '#ffec99',
                border: 'none',
                borderRadius: '.4rem',
                cursor: 'pointer',
                margin: '1rem .5rem .5rem auto',
              }}
            >
              {'>>>'}
            </button>}
          </div>
        </>
      </BaseModal>
    )
  }

  return (
    <BaseModal
      title=''
      onClose={() => setAppSettings({ action: SetAppSettingsActionEnum.EMPTY_FOUD_ITEMS_MODAL, payload: null })}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
        <h1 style={{ fontSize: '2rem', padding: '1rem' }}>It Is Empty</h1>
        <h1 style={{ fontSize: '3rem' }}>📦</h1>
      </div>
    </BaseModal>
  )
}

export default ItemsFoundModal