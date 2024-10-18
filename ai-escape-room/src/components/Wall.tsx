/* eslint-disable react/prop-types */
import { Graphics, ReactPixiRoot } from '@pixi/react'
import { useCallback, useContext, useReducer } from 'react'
import { AppSettingsContext } from '../context/AppSettingsContext'
import React from 'react'
import { AppSettingsContextType } from '../shared/types'

export const Wall = ({ color, children } : { color: string, children: React.ReactNode  }) => {
  const { appSettings: { screenSettings: { width, height } } } : AppSettingsContextType = useContext(AppSettingsContext)

  const draw = useCallback((g: any) => {
      g.clear()
      g.beginFill(color)
      g.drawRect(0, 0, width, height)
      g.endFill()
    },
    [color],
  )

  return (
    <>
      <Graphics draw={draw} />
      {children}
    </>
  )
}
