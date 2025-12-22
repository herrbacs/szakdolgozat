import React, { useCallback, useContext, useMemo } from "react"
import { AppSettingsContextType } from "../../../shared/types/frameworkTypes"
import { SetAppSettingsActionEnum } from "../../../shared/enums"
import { AppSettingsContext } from "../../../context/AppSettingsContext"
import { Color, Graphics, GraphicsContext, PointData } from "pixi.js"
import { Triangle, TriangleDirection } from "../Triangle"
import { selectCurrentWallIndex } from "../../../reducer/selectors/derivedSelectors"
import { selecScreenDimension } from "../../../reducer/selectors/baseSelectors"
import { emptyCursorActions } from "../../../reducer/controllerHelpers"

const Map = () => {
  const { appSettings, setAppSettings }: AppSettingsContextType = useContext(AppSettingsContext)

  const wallOrientation = [
    TriangleDirection.UP,
    TriangleDirection.RIGHT,
    TriangleDirection.DOWN,
    TriangleDirection.LEFT,
  ]

  const drawCircle = useCallback((g: GraphicsContext) => {
    g
      .circle(0, 0, 5)
      .fill({ color: 0xc2c2c2 })
  }, [])

  const position = useMemo(() => {
    const { width, height } = selecScreenDimension(appSettings)

    const ratio = 55
    const xRatio = ratio / width
    const yRatio = ratio / height

    const x = width * xRatio
    const y = height * yRatio

    return { x, y }
  }, [appSettings.screenSettings.dimension])

  const calculatePosition = useCallback((orientation: TriangleDirection): PointData => {
    const { x, y } = position
    const relativePostition = 30

    switch (orientation) {
      case TriangleDirection.UP:
        return { x, y: x - relativePostition }
      case TriangleDirection.RIGHT:
        return { x: x + relativePostition, y }
      case TriangleDirection.DOWN:
        return { x: x, y: y + relativePostition }
      case TriangleDirection.LEFT:
        return { x: x - relativePostition, y }
      default:
        return position
    }
  }, [appSettings.screenSettings.dimension])

  const handleClick = (wallIndex: number) => {
    setAppSettings({ action: SetAppSettingsActionEnum.SET_CURSOR_ACTIONS, payload: emptyCursorActions() })
    setAppSettings({ action: SetAppSettingsActionEnum.MOVE_TO, payload: wallIndex })
  }

  return (
    <>
      <pixiGraphics
        position={position}
        draw={(g: Graphics) => drawCircle(g.context)}
      />
      {
        wallOrientation.map((orientation, index) =>
          <Triangle
            key={index}
            color={selectCurrentWallIndex(appSettings) === index ? new Color('#ffe066') : new Color('#ffffff')}
            strokeColor={new Color('#555555')}
            strokeWidth={2}
            direction={orientation}
            position={calculatePosition(orientation)}
            onClick={() => handleClick(index)}
          />
        )
      }
    </>
  )
}

export default Map