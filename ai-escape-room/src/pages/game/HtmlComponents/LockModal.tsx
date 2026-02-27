import React, { useCallback, useContext, useEffect, useState } from 'react'
import BaseModal from './BaseModal'
import { AppSettingsContextType } from '../../../shared/types/frameworkTypes'
import { AppSettingsContext } from '../../../context/AppSettingsContext'
import { SetAppSettingsActionEnum } from '../../../shared/enums'

const LockModal = () => {
  const {
    appSettings: { gameInformation: { lockModal } },
    setAppSettings
  }: AppSettingsContextType = useContext(AppSettingsContext)

  const [values, setValues] = useState<string[]>([])
  const [singleValue, setSingleValue] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const [wrong, setWrong] = useState(false)
  const [displayHints, setDisplayHints] = useState(false)
  const [currentHintIndex, setCurrentHintIndex] = useState<number>(0)
  const [showHintReveals, setShowHintReveals] = useState<boolean>(false)

  const isLong = lockModal ? lockModal?.lock?.activator.length > 10 : false
  const isFirstHint = currentHintIndex === 0
  const isLastHint = currentHintIndex === lockModal?.hints.length! - 1

  const handleUnlock = useCallback(() => {
    if (!lockModal) return

    const code = isLong ? singleValue : values.join('')
    const ok = code.toUpperCase() === lockModal.lock.activator.toUpperCase()

    if (ok) {
      setAppSettings({ action: SetAppSettingsActionEnum.SET_LOCK_MODAL, payload: null })
      lockModal.openCallback?.()
    } else {
      setWrong(true)
      window.setTimeout(() => setWrong(false), 350)
    }
  }, [lockModal, isLong, singleValue, values, setAppSettings])

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
        if (e.key === 'Enter') {
          e.preventDefault()
          if (isComplete) handleUnlock()
          return
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeIndex, lockModal, values.length, singleValue, handleUnlock])

  const isComplete = isLong ? singleValue.length === lockModal!.lock.activator.length : values.every(v => v !== '')

  return lockModal && (
    <BaseModal
      title={lockModal.title}
      onClose={() => setAppSettings({ action: SetAppSettingsActionEnum.SET_LOCK_MODAL, payload: null })}
    >
      <div className={`lock-inputRow ${wrong ? 'lock-wrong' : ''}`} style={{ position: 'relative' }}>
        {isLong ? (
          <input
            type="text"
            value={singleValue}
            readOnly
            className="lock-longInput"
            style={{
              width: `calc(${lockModal.lock.activator.length}ch + ${lockModal.lock.activator.length}*0.4rem)`,
              fontSize: '1.5rem',
              textAlign: 'center',
              letterSpacing: '0.3rem',
              padding: '0.5rem',
              borderRadius: '.3rem',
              border: '2px solid #555',
              backgroundColor: '#fff',
              color: '#000000',
              boxShadow: '0 0 0 3px rgba(0, 0, 0, 0.25)'
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
                border: i === activeIndex ? '3px solid #ffec99' : '3px solid #555',
                cursor: 'pointer',
                userSelect: 'none',
                color: '#000000',
                boxShadow: '0px 0px 8px 1px rgba(0,0,0,1) inset'
              }}
            >
              {val}
            </div>
          ))
        )}
      </div>
      <div style={{ position: 'relative', display: 'flex', width: '100%', padding: '0 0 1rem 0' }}>
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
            marginBottom: '1rem',
            boxShadow: isComplete ? '0px 5px 15px rgba(0, 0, 0, 0.35)' : 'none',
            margin: '0 auto 0 auto'
          }}
        >
          Kinyitás
        </button>
        <span 
          style={{position: 'absolute', right: '1.2rem', bottom: '1rem', fontSize: '2rem', textAlign: 'center', cursor: 'pointer', color: '#FFF' }}
          onClick={() => setDisplayHints(!displayHints)}
        >?</span>
      </div>
      {
        displayHints && (
          <div style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
            <span
              onClick={() => {setCurrentHintIndex(currentHintIndex - 1); setShowHintReveals(false)}}
              style={{
                fontSize: '3rem',
                color: '#ffec99',
                cursor: 'pointer',
                margin: '0 auto 0 1rem',
                visibility: isFirstHint ? 'hidden' : 'visible'
              }}
            >
              {'<'}
            </span>
            <span style={{ display: 'flex', flexDirection: 'column',  margin: '0 auto', fontStyle: 'italic' }}>
              <span style={{ color: '#fff', }}>{ lockModal.hints[currentHintIndex].hint }</span>
              <span
                style={{ 
                  color: '#ffec99',
                  textAlign: 'center',
                  cursor: 'pointer',
                  fontSize: '1.5rem',
                  filter: showHintReveals ? '' : 'blur(6px)'
                }}
                onClick={() => setShowHintReveals(true)}  
              >{ lockModal.hints[currentHintIndex].reveals }</span>
            </span>
            <span
              onClick={() => {setCurrentHintIndex(currentHintIndex + 1); setShowHintReveals(false)}}
              style={{
                fontSize: '3rem',
                color: '#ffec99',
                cursor: 'pointer',
                margin: '0 1rem 0 auto',
                visibility: isLastHint ? 'hidden' : 'visible'
              }}
            >
              {'>'}
            </span>
          </div>
        )
      }
    </BaseModal>
  )
}

export default LockModal
