import React, { useContext } from 'react';
import { AppSettingsContext } from '../../../context/AppSettingsContext'
import { AppSettingsContextType } from '../../../shared/types/frameworkTypes'
import { SetAppSettingsActionEnum } from '../../../shared/enums';
import { emptyCursorActions } from '../../../reducer/controllerHelpers';
import { spriteUrl } from '../../../shared/urls';

const CursorActions = () => {
  const {
    appSettings: {
      gameInformation: {
        cursorActions: { position, examine, search, take, use },
        levelId
      },
    },
    setAppSettings
  }: AppSettingsContextType = useContext(AppSettingsContext)

  const examineItem = () => {
    setAppSettings({ action: SetAppSettingsActionEnum.TOGGLE_OBJECT_INSPECTING, payload: examine })
  }

  const getActions = () => {
    const arr = []
    if (examine) {
      arr.push({ textureSrc: spriteUrl(levelId, 'cursor_examine'), action: examineItem })
    }
    if (search) {
      arr.push({ textureSrc: spriteUrl(levelId, 'cursor_search'), action: search.action })
    }
    if (take) {
      arr.push({ textureSrc: spriteUrl(levelId, 'cursor_take'), action: take.action })
    }
    if (use) {
      arr.push({ textureSrc: spriteUrl(levelId, 'cursor_use'), action: use.action })
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
             style={{
              width: '4rem',
              height: '4rem',
              objectFit: 'contain',
              display: 'block',
            }}
          />
        ))
      }
    </div>
  )
}

export default CursorActions
