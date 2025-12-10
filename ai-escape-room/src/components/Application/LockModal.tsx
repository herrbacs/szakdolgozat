import React, { useContext, useEffect, useRef, useState } from 'react'
import { AppSettingsContextType } from '../../shared/types/frameworkTypes'
import { AppSettingsContext } from '../../context/AppSettingsContext'
import { SetAppSettingsActionEnum } from '../../shared/enums'

const LockModal = () => {
  const { appSettings: { gameInformation: { lockModal } }, setAppSettings } : AppSettingsContextType = useContext(AppSettingsContext)
  const [values, setValues] = useState<string[]>([])
  const inputsRef = useRef<HTMLInputElement[]>([])

  useEffect(() => {
    if (lockModal?.lock?.activator) {
      setValues(Array(lockModal?.lock.activator.length).fill(""))
    }
  }, [lockModal])

  const handleInput = (value: string, index: number) => {
    const newValues = [...values]
    newValues[index] = value.slice(-1)
    setValues(newValues)

    if (value && inputsRef.current[index + 1]) {
      inputsRef.current[index + 1].focus()
    }
  }

  const handleUnlock = () => {
    const code = values.join("")
    if (code === lockModal!.lock.activator) {
      setAppSettings({ action: SetAppSettingsActionEnum.SET_LOCK_MODAL , payload: null })
      lockModal?.openCallback()
    }
  }

  const isComplete = values.every(v => v !== "")

  return lockModal && (
    <div style={{ width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, .5)', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0 }}>
      <div style={{ backgroundColor: '#8f8f8f', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', maxWidth: '80%', maxHeight: '80%', borderRadius: '.5rem'}}>
        <div style={{position: 'relative', display: 'flex', width: '100%', textTransform: 'uppercase', color: '#FFF', fontWeight: 'bold'}}>
          <div 
            onClick={() => setAppSettings({ action: SetAppSettingsActionEnum.SET_LOCK_MODAL , payload: null })}
            style={{marginLeft: 'auto', marginRight: '.5rem', cursor: 'pointer'}}
          >
            ✕
          </div>
        </div>
        <div style={{display: 'flex', gap: '.5rem', margin: '1rem'}}>
          {values.map((val, i) => (
            <input
              key={i}
              ref={(el) => {if (el) inputsRef.current[i] = el}}
              maxLength={1}
              value={val}
              onChange={(e) => handleInput(e.target.value, i)}
              style={{
                width: '2.5rem',
                height: '2.5rem',
                textAlign: 'center',
                fontSize: '1.5rem',
                borderRadius: '.3rem',
                border: '2px solid #555',
              }}
            />
          ))}
        </div>
        <button 
          onClick={handleUnlock}
          disabled={!isComplete}
          style={{
            padding: '.5rem 2rem',
            fontSize: '1.1rem',
            color: isComplete ? '#333333' : '#FFFFFF',
            backgroundColor: isComplete ? '#ffec99' : '#777',
            border: 'none',
            borderRadius: '.4rem',
            cursor: isComplete ? 'pointer' : 'default',
            marginTop: '1rem',
            marginBottom: '1rem',
          }}
        >
          Kinyitás
        </button>
      </div>
    </div>
  )
}

export default LockModal
