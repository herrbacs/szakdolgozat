/* eslint-disable react/prop-types */
import { createContext, useState } from 'react'

export const AppSettingsContext = createContext()

export default function AppContextProvider({ children }) {
  const [appSettings] = useState({
    screen: {
      width: 500,
      height: 500
    },
    movementDimension: {
      width: 109,
      height: 104,
    }
  })

  return (
    <>
      <AppSettingsContext.Provider value={{ appSettings }}>
        { children }
      </AppSettingsContext.Provider>
    </>
  )
}
