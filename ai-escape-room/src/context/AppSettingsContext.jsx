/* eslint-disable react/prop-types */
import { createContext, useReducer } from 'react'
import { initialState, reducer } from '../reducer/reducer'

export const AppSettingsContext = createContext()

export default function AppContextProvider({ children }) {
  const [appSettings, setAppSettings] = useReducer(reducer, initialState)

  return (
    <>
      <AppSettingsContext.Provider value={{ appSettings, setAppSettings }}>
        { children }
      </AppSettingsContext.Provider>
    </>
  )
}
