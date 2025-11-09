// @ts-expect-error: missing type declarations, but works at runtime
import { Graphics, Text } from '@pixi/react'
import React, { useContext, useCallback, useMemo } from 'react'
import { AppSettingsContext } from '../../context/AppSettingsContext'
import { AppSettingsContextType } from '../../shared/types/frameworkTypes'
import { SetAppSettingsActionEnum } from '../../shared/enums'

const ToggleInventory = () => {
  const padding = 40
  const { appSettings: { screenSettings: { dimension: { width } } }, setAppSettings }: AppSettingsContextType = useContext(AppSettingsContext)

  const drawCircle = useCallback((g: any) => {
    g.clear()
    g.beginFill(0xc2c2c2)
    g.lineStyle(3, 0xFFFFFF)
    g.drawCircle(0, 0, 32)
    g.endFill()
  }, [])

  const calculateX = useMemo(
    () => (width - padding),
    [width]
  )

  return (
    <Graphics
      x={calculateX}
      y={padding}
      interactive={true}
      buttonMode={true}
      pointertap={() => setAppSettings({ action: SetAppSettingsActionEnum.TOGGLE_INVENTORY })}
      draw={drawCircle}
    >
      <Text
        text="I"
        anchor={0.5}
        x={0}
        y={0}
        style={{
          fill: 0xffec99,
          fontSize: 32,
          fontWeight: 'bold'
        }}
      />
    </Graphics>
  )
}

export default ToggleInventory
