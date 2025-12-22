import React, { useContext, useEffect, useMemo, useState } from 'react'
import { AppSettingsContextType } from '../../shared/types/frameworkTypes'
import { AppSettingsContext } from '../../context/AppSettingsContext'
import { SetAppSettingsActionEnum } from '../../shared/enums'
import BaseModal from './BaseModal'

const LockModal = () => {
  const {
    appSettings: { gameInformation: { lockModal } },
    setAppSettings
  }: AppSettingsContextType = useContext(AppSettingsContext)

  const [values, setValues] = useState<string[]>([])
  const [singleValue, setSingleValue] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)

  const isLong = lockModal ? lockModal?.lock?.activator.length > 10 : false

  useEffect(() => {
    if (lockModal?.lock?.activator) {
      if (isLong) {
        setSingleValue('')
      } else {
        setValues(Array(lockModal.lock.activator.length).fill(''))
        setActiveIndex(0)
      }
    }
  }, [lockModal])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lockModal) return
      const key = e.key.toUpperCase()

      if (isLong) {
        if (e.key.length === 1) {
          e.preventDefault()
          setSingleValue(prev =>
            (prev + key).slice(0, lockModal.lock.activator.length)
          )
        }
        if (e.key === 'Backspace') {
          e.preventDefault()
          setSingleValue(prev => prev.slice(0, -1))
        }
      } else {
        if (e.key.length === 1) {
          e.preventDefault()
          setValues(prev => {
            const next = [...prev]
            next[activeIndex] = key
            return next
          })
          setActiveIndex(i => Math.min(i + 1, values.length - 1))
        }
        if (e.key === 'Backspace') {
          e.preventDefault()
          setValues(prev => {
            const next = [...prev]
            next[activeIndex] = ''
            return next
          })
          setActiveIndex(i => Math.max(i - 1, 0))
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeIndex, lockModal, values.length, singleValue])

  const handleUnlock = () => {
    const code = isLong ? singleValue : values.join('')
    if (code.toUpperCase() === lockModal!.lock.activator.toUpperCase()) {
      setAppSettings({ action: SetAppSettingsActionEnum.SET_LOCK_MODAL, payload: null })
      lockModal?.openCallback()
    }
  }

  const isComplete = isLong ? singleValue.length === lockModal!.lock.activator.length : values.every(v => v !== '')

  return lockModal && (
    <BaseModal
      title=''
      onClose={() => setAppSettings({ action: SetAppSettingsActionEnum.SET_LOCK_MODAL, payload: null })}
    >
      <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0', gap: '.5rem' }}>
        {isLong ? (
          <input
            type="text"
            value={singleValue}
            readOnly
            style={{
              width: `calc(${lockModal.lock.activator.length}ch + ${lockModal.lock.activator.length}*0.4rem)`,
              fontSize: '1.5rem',
              textAlign: 'center',
              letterSpacing: '0.3rem',
              padding: '0.5rem',
              borderRadius: '.3rem',
              border: '2px solid #555',
              backgroundColor: '#fff',
              color: '#000000'
            }}
            placeholder={'X'.repeat(lockModal.lock.activator.length)}
          />
        ) : (
          values.map((val, i) => (
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
                userSelect: 'none',
                color: '#000000'
              }}
            >
              {val}
            </div>
          ))
        )}
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
    </BaseModal>
  )
}

export default LockModal
