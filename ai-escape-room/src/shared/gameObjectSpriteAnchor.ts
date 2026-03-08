import { PositionEnum } from "./enums"

const FLOOR_POSITIONS: PositionEnum[] = [
  PositionEnum.F1,
  PositionEnum.F2,
  PositionEnum.F3,
]

export const getAnchorByObjectPosition = (position: PositionEnum) => ({
  x: 0.5,
  y: FLOOR_POSITIONS.includes(position) ? 1 : 0.5,
})
