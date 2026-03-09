import { SizeEnum } from "./enums"
import { Dimension } from "./types/gameBaseTypes"

const SIZE_SCALE_MAP: Record<SizeEnum, number> = {
  [SizeEnum.S]: 0.04,
  [SizeEnum.M]: 0.08,
  [SizeEnum.L]: 0.2,
}

const BASE_SCREEN_DIMENSION: Dimension = {
  width: 1280,
  height: 720,
}

const getScreenScaleFactor = (dimension: Dimension): number => {
  const widthRatio = dimension.width / BASE_SCREEN_DIMENSION.width
  const heightRatio = dimension.height / BASE_SCREEN_DIMENSION.height
  const ratio = Math.min(widthRatio, heightRatio)
  const squaredRatio = Math.pow(ratio, 2)

  return Math.max(0.7, Math.min(1.8, squaredRatio))
}

const getScaleByObjectSize = (size?: SizeEnum | null): number => {
  if (!size) {
    return SIZE_SCALE_MAP[SizeEnum.M]
  }

  return SIZE_SCALE_MAP[size]
}

export const getResponsiveScaleByObjectSize = (
  size: SizeEnum | null | undefined,
  dimension: Dimension
): number => {
  return getScaleByObjectSize(size) * getScreenScaleFactor(dimension)
}
