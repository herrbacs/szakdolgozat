import React, { useContext } from 'react'
import { AppSettingsContext } from '../../context/AppSettingsContext'
import { AppSettingsContextType } from '../../shared/types/frameworkTypes'
import { SetAppSettingsActionEnum } from '../../shared/enums'


const NotepadModal = () => {
  const { appSettings: { gameInformation: { notepad: { content, visible } } }, setAppSettings }: AppSettingsContextType = useContext(AppSettingsContext)


  return visible && (
    <div
      style={{ position: 'absolute', inset: 0, background: 'rgba(0, 0, 0, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
      onClick={() => setAppSettings({ action: SetAppSettingsActionEnum.TOGGLE_NOTEPAD })}
    >
      <div
        style={{ width: '50%', height: '80%', background: '#fdf6e3', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)', padding: '16px', display: 'flex', flexDirection: 'column' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h2 style={{ margin: 0, textAlign: 'center', width: '100%' }}>Notepad</h2>
          <button
            style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}
            onClick={() => setAppSettings({ action: SetAppSettingsActionEnum.TOGGLE_NOTEPAD })}
          >
            ✕
          </button>
        </div>
        <textarea
          style={{ flex: 1, fontFamily: 'Patrick Hand', resize: 'none', border: 'none', outline: 'none', padding: '12px', fontSize: '27px', color: '#333', backgroundColor: '#fdf6e3' }}
          placeholder='You can note here...'
          value={content}
          onChange={(e) => setAppSettings({ action: SetAppSettingsActionEnum.UPDATE_NOTEPAD, payload: e.target.value })}
        />
      </div>
    </div>
  )
}

export default NotepadModal