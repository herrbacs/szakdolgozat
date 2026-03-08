import { SizeEnum } from "./enums"

const SIZE_SCALE_MAP: Record<SizeEnum, number> = {
  [SizeEnum.S]: 0.04,
  [SizeEnum.M]: 0.08,
  [SizeEnum.L]: 0.2,
}

export const getScaleByObjectSize = (size?: SizeEnum | null): number => {
  if (!size) {
    return SIZE_SCALE_MAP[SizeEnum.M]
  }

  return SIZE_SCALE_MAP[size]
}
