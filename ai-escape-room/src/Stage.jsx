/* eslint-disable react/prop-types */
import { AppSettingsContext } from './context/AppSettingsContext'
import { Stage as PixiStage } from '@pixi/react'

const ContextBridge = ({ children, Context, render }) => {
  return (
    <Context.Consumer>
      {(value) => render(<Context.Provider value={value}>{children}</Context.Provider>)}
    </Context.Consumer>
  )
}

export const Stage = ({ children, ...props }) => {
  return (
    <ContextBridge
        Context={AppSettingsContext}
        render={(children) => <PixiStage {...props}>{children}</PixiStage>}
    >
      {children}
    </ContextBridge>
  )
}