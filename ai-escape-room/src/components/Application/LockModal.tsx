import React, { useContext, useEffect, useState } from 'react'
import { AppSettingsContextType } from '../../shared/types/frameworkTypes'
import { AppSettingsContext } from '../../context/AppSettingsContext'
import { SetAppSettingsActionEnum } from '../../shared/enums'

const LockModal = () => {
  const {
    appSettings: { gameInformation: { lockModal } },
    setAppSettings
  }: AppSettingsContextType = useContext(AppSettingsContext)

  const [values, setValues] = useState<string[]>([])
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (lockModal?.lock?.activator) {
      setValues(Array(lockModal.lock.activator.length).fill(''))
      setActiveIndex(0)
    }
  }, [lockModal])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lockModal) return

      const key = e.key.toUpperCase()

      if (e.key.length === 1) {
        e.preventDefault()

        setValues(prev => {
          const next = [...prev]
          next[activeIndex] = key
          return next
        })

        setActiveIndex(i =>
          Math.min(i + 1, values.length - 1)
        )
      }

      // Törlés
      if (e.key === 'Backspace') {
        e.preventDefault()

        setValues(prev => {
          const next = [...prev]
          next[activeIndex] = ''
          return next
        })

        setActiveIndex(i =>
          Math.max(i - 1, 0)
        )
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeIndex, lockModal, values.length])

  const handleUnlock = () => {
    const code = values.join('')
    if (code.toUpperCase() === lockModal!.lock.activator.toUpperCase()) {
      setAppSettings({ action: SetAppSettingsActionEnum.SET_LOCK_MODAL, payload: null })
      lockModal?.openCallback()
    }
  }

  const isComplete = values.every(v => v !== '')

  return lockModal && (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, .5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0
      }}
    >
      <div
        style={{
          backgroundColor: '#8f8f8f',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: '80%',
          borderRadius: '.5rem'
        }}
      >
        {/* Close */}
        <div style={{ width: '100%', textAlign: 'right' }}>
          <span
            onClick={() =>
              setAppSettings({ action: SetAppSettingsActionEnum.SET_LOCK_MODAL, payload: null })
            }
            style={{ cursor: 'pointer', marginRight: '.5rem', color: '#fff' }}
          >
            ✕
          </span>
        </div>

        {/* Code boxes */}
        <div style={{ display: 'flex', gap: '.5rem', margin: '1rem' }}>
          {values.map((val, i) => (
            <div
              key={i}
              onClick={() => setActiveIndex(i)}
              style={{
                width: '2.5rem',
                height: '2.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                backgroundColor: '#fff',
                borderRadius: '.3rem',
                border: i === activeIndex ? '3px solid #ffec99' : '2px solid #555',
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              {val}
            </div>
          ))}
        </div>

        <button
          onClick={handleUnlock}
          disabled={!isComplete}
          style={{
            padding: '.5rem 2rem',
            fontSize: '1.1rem',
            backgroundColor: isComplete ? '#ffec99' : '#777',
            border: 'none',
            borderRadius: '.4rem',
            cursor: isComplete ? 'pointer' : 'default',
            marginBottom: '1rem'
          }}
        >
          Kinyitás
        </button>
      </div>
    </div>
  )
}

export default LockModal
