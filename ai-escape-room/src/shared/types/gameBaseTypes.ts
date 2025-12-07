import { UUID } from "crypto"
import { LockTypeEnum, SizeEnum } from "../enums"

export type Lock = {
  type: LockTypeEnum
  activator: string | UUID
  open: boolean
}

export type Dimension = {
  width: number,
  height: number,
}

export type SpriteData = {
  fileName: string,
  dimension: Dimension,
  size: null | SizeEnum,
}

export type Sprite = {
  default: SpriteData,
  perspective: null | SpriteData,
}

export type SpriteSet = {
  idle: Sprite,
  active: Sprite,
}

export type InspectionData = {
  appellation: string,
  information: string,
}
