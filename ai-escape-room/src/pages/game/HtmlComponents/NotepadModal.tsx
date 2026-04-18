import React, { useContext } from 'react'
import { AppSettingsContextType } from '../../../shared/types/frameworkTypes'
import { AppSettingsContext } from '../../../context/AppSettingsContext'
import { SetAppSettingsActionEnum } from '../../../shared/enums'

const NotepadModal = () => {
  const { appSettings: { gameInformation: { notepad: { content, visible } } }, setAppSettings }: AppSettingsContextType = useContext(AppSettingsContext)

  return visible && (
    <div
      className="absolute inset-0 z-[980] flex items-center justify-center bg-slate-950/45 px-4 py-6 backdrop-blur-sm"
      onClick={() => setAppSettings({ action: SetAppSettingsActionEnum.TOGGLE_NOTEPAD })}
    >
      <div
        className="flex h-[80vh] w-full max-w-4xl flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_28px_80px_rgba(15,23,42,0.35)] ring-1 ring-black/5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative flex items-center border-b border-slate-200 bg-gradient-to-r from-white via-slate-50 to-white px-6 py-5">
          <h2 className="w-full text-center text-2xl font-semibold tracking-tight text-slate-800">Notepad</h2>
          <button
            type="button"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xl font-semibold text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
            onClick={() => setAppSettings({ action: SetAppSettingsActionEnum.TOGGLE_NOTEPAD })}
          >
            &times;
          </button>
        </div>
        <div className="flex-1 bg-slate-50 p-5">
          <div className="h-full rounded-3xl bg-[linear-gradient(180deg,_#fffdf5_0%,_#fff8e7_100%)] p-4 shadow-inner ring-1 ring-amber-100">
            <textarea
              style={{ width: '100%', height: '100%', resize: 'none', border: 'none', outline: 'none', padding: '12px', fontSize: '27px', fontFamily: 'Patrick Hand', color: '#333', backgroundColor: 'transparent' }}
              placeholder='You can note here...'
              value={content}
              onChange={(e) => setAppSettings({ action: SetAppSettingsActionEnum.UPDATE_NOTEPAD, payload: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotepadModal
