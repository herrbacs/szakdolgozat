import React, { useContext, useRef } from 'react';
import { useCallback, useMemo } from 'react';
import { AppSettingsContext } from '../../context/AppSettingsContext'
import { AppSettingsContextType } from '../../shared/types/frameworkTypes'
import { Graphics, GraphicsContext } from 'pixi.js';
import { SetAppSettingsActionEnum } from '../../shared/enums';

const ToggleInventory = () => {
  const padding = 40
  const { appSettings: { screenSettings: { dimension: { width } } }, setAppSettings }: AppSettingsContextType = useContext(AppSettingsContext)

  const drawCircle = useCallback((g: GraphicsContext) => {
      g.circle(0, 0, 32)
      .fill({ color: 0xc2c2c2 })
      .stroke({ width: 3, color: 0xFFFFFF })
  }, [])

  const calculateX = useMemo(
    () => (width - padding),
    [width]
  )

  return (
    <pixiGraphics
      x={calculateX}
      y={padding}
      draw={(g: Graphics) => drawCircle(g.context)}
      eventMode="static"
      cursor="pointer"
      onPointerTap={() => setAppSettings({ action: SetAppSettingsActionEnum.TOGGLE_INVENTORY })}
    >
      <pixiText 
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
    </pixiGraphics>
  )
}

export default ToggleInventory
