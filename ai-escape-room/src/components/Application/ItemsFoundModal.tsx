import React, { useContext, useState } from 'react'
import { AppSettingsContext } from '../../context/AppSettingsContext'
import { AppSettingsContextType } from '../../shared/types/frameworkTypes'
import { GameObjectTypeEnum, SetAppSettingsActionEnum } from '../../shared/enums'

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

  const isFirstElement = currentItemIndex === 0
  const isLastElement = currentItemIndex === itemsFoundModal?.length! - 1

  if (itemsFoundModal === null) {
    return
  }

  if (itemsFoundModal.length > 0) {
    return (
      <div style={{ width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, .5)', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0 }}>
        <div style={{ backgroundColor: '#8f8f8f', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', maxWidth: '80%', maxHeight: '80%', borderRadius: '.5rem' }}>
          <div style={{ position: 'relative', padding: '.5rem 0', display: 'flex', flexDirection: 'column', width: '100%', textTransform: 'uppercase', color: '#FFFF', fontWeight: 'bold' }}>
            <div style={{ width: '100%', fontSize: '1.5rem', textAlign: 'center' }}>
              {itemsFoundModal[currentItemIndex].object.inspectionData.appellation}
            </div>
            <div 
              style={{ position: 'absolute', right: '1rem', textAlign: 'center', cursor: 'pointer' }}
              onClick={() => setAppSettings({ action: SetAppSettingsActionEnum.EMPTY_FOUD_ITEMS , payload: null })}
            >
              ✕
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <h1 style={{ width: '90%' }}>
                  {renderIcon()}
                </h1>
              </div>
              <div style={{ width: '90%', display: 'flex', fontSize: '1.2rem', textTransform: 'uppercase', color: '#ffec99', justifyContent: 'center' }}>
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
                  marginTop: '1rem',
                  marginBottom: '1rem',
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
                  marginTop: '1rem',
                  marginBottom: '1rem',
                }}
              >
                {'>>>'}
              </button>}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
      <div style={{ width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, .5)', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0 }}>
      <div style={{ backgroundColor: '#8f8f8f', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', maxWidth: '80%', maxHeight: '80%', borderRadius: '.5rem' }}>
        <div style={{ position: 'relative', padding: '.5rem 0', display: 'flex', flexDirection: 'column', width: '100%', textTransform: 'uppercase', color: '#FFFF', fontWeight: 'bold' }}>
          <div 
            style={{ position: 'absolute', right: '1rem', textAlign: 'center', cursor: 'pointer' }}
            onClick={() => setAppSettings({ action: SetAppSettingsActionEnum.EMPTY_FOUD_ITEMS , payload: null })}
          >
            ✕
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
            <h1 style={{ fontSize: '2rem', padding: '1rem'}}>It Is Empty</h1>
            <h1 style={{ fontSize: '3rem' }}>📦</h1>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ItemsFoundModal