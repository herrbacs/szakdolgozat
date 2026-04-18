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
  }, [lockModal, isLong])

  const isComplete = isLong
    ? singleValue.length === lockModal!.lock.activator.length
    : values.every(v => v !== '')

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
  }, [activeIndex, handleUnlock, isComplete, isLong, lockModal, singleValue, values.length])

  return lockModal && (
    <BaseModal
      title={lockModal.title}
      onClose={() => setAppSettings({ action: SetAppSettingsActionEnum.SET_LOCK_MODAL, payload: null })}
    >
      <div className="w-full px-6 pb-8 pt-6">
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
                padding: '0.85rem',
                borderRadius: '1rem',
                border: '1px solid #cbd5e1',
                backgroundColor: '#f8fafc',
                color: '#0f172a',
                boxShadow: 'inset 0 1px 3px rgba(15, 23, 42, 0.08)'
              }}
              placeholder={'X'.repeat(lockModal.lock.activator.length)}
            />
          ) : (
            values.map((val, i) => (
              <div
                key={i}
                onClick={() => setActiveIndex(i)}
                style={{
                  width: '3rem',
                  height: '3rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  backgroundColor: '#f8fafc',
                  borderRadius: '1rem',
                  border: i === activeIndex ? '2px solid #6366f1' : '1px solid #cbd5e1',
                  cursor: 'pointer',
                  userSelect: 'none',
                  color: '#0f172a',
                  boxShadow: 'inset 0 1px 2px rgba(15, 23, 42, 0.08)'
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
            className={`mx-auto mb-4 rounded-xl px-6 py-3 text-sm font-semibold text-white transition ${
              isComplete
                ? 'bg-indigo-600 shadow-lg shadow-indigo-200 hover:bg-indigo-700'
                : 'cursor-default bg-slate-300'
            }`}
          >
            Unlock
          </button>
          <button
            type="button"
            className="absolute bottom-4 right-0 flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-xl font-semibold text-slate-500 ring-1 ring-slate-200 transition hover:bg-slate-200 hover:text-slate-700"
            onClick={() => setDisplayHints(!displayHints)}
          >
            ?
          </button>
        </div>
        {displayHints && (
          <div className="flex w-full items-center rounded-2xl bg-slate-50 px-3 py-4 ring-1 ring-slate-200">
            <span
              onClick={() => { setCurrentHintIndex(currentHintIndex - 1); setShowHintReveals(false) }}
              style={{
                fontSize: '3rem',
                color: '#6366f1',
                cursor: 'pointer',
                margin: '0 auto 0 1rem',
                visibility: isFirstHint ? 'hidden' : 'visible'
              }}
            >
              {'<'}
            </span>
            <span style={{ display: 'flex', flexDirection: 'column', margin: '0 auto', fontStyle: 'italic' }}>
              <span style={{ color: '#334155', textAlign: 'center' }}>{lockModal.hints[currentHintIndex].hint}</span>
              <span
                style={{
                  color: '#4f46e5',
                  textAlign: 'center',
                  cursor: 'pointer',
                  fontSize: '1.5rem',
                  filter: showHintReveals ? '' : 'blur(6px)'
                }}
                onClick={() => setShowHintReveals(true)}
              >
                {lockModal.hints[currentHintIndex].reveals}
              </span>
            </span>
            <span
              onClick={() => { setCurrentHintIndex(currentHintIndex + 1); setShowHintReveals(false) }}
              style={{
                fontSize: '3rem',
                color: '#6366f1',
                cursor: 'pointer',
                margin: '0 1rem 0 auto',
                visibility: isLastHint ? 'hidden' : 'visible'
              }}
            >
              {'>'}
            </span>
          </div>
        )}
      </div>
    </BaseModal>
  )
}

export default LockModal
