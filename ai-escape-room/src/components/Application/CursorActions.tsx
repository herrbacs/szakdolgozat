import React, { useContext } from 'react';
import { AppSettingsContext } from '../../context/AppSettingsContext'
import { AppSettingsContextType } from '../../shared/types/frameworkTypes'
import { SetAppSettingsActionEnum } from '../../shared/enums';
import { emptyCursorActions } from '../../reducer/controllerHelpers';

const CursorActions = () => {
  const {
    appSettings: { gameInformation: { cursorActions: { position, examine, search, take, use } } },
    setAppSettings
  }: AppSettingsContextType = useContext(AppSettingsContext)

  const examineItem = () => {
    setAppSettings({ action: SetAppSettingsActionEnum.TOGGLE_OBJECT_INSPECTING, payload: examine })
  }

  const getActions = () => {
    const arr = []
    if (examine) {
      arr.push({ textureSrc: 'http://localhost:5000/images/cursor_examine.jpg', action: examineItem })
    }
    if (search) {
      arr.push({ textureSrc: 'http://localhost:5000/images/cursor_search.jpg', action: search.action })
    }
    if (take) {
      arr.push({ textureSrc: 'http://localhost:5000/images/cursor_take.jpg', action: take.action })
    }
    if (use) {
      arr.push({ textureSrc: 'http://localhost:5000/images/cursor_use.jpg', action: use.action })
    }

    return arr
  }

  const handleAction = (action: () => void) => {
    setAppSettings({ action: SetAppSettingsActionEnum.SET_CURSOR_ACTIONS, payload: emptyCursorActions() })
    action()
  }

  return position && (
    <div style={{ position: 'fixed', left: position.x,  top: position.y, display: 'flex', backgroundColor: '#ffe066af', gap: '.5rem', padding: '.5rem' }}>
      {
        getActions().map(({ textureSrc, action }, index) => (
          <img
            key={index}
            src={textureSrc}
            className='cursor-action-img'
            onClick={() => handleAction(action)}
          />
        ))
      }
    </div>
  )
}

export default CursorActions
