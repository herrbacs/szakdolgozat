/* eslint-disable react/prop-types */
import { Graphics } from '@pixi/react'
import { useCallback, useReducer } from 'react'
import { initialState, reducer } from '../reducer/reducer'

export const Wall = ({ color, children }) => {
    const [appSettings] = useReducer(reducer, initialState)

    const draw = useCallback(
        (g) => {
          g.clear()
          g.beginFill(color)
          g.drawRect(0, 0, appSettings.screen.width, appSettings.screen.height)
          g.endFill()
        },
        [appSettings, color],
    )
    return (
      <>
        <Graphics draw={draw} />
        {children}
      </>
    )
}
