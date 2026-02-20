import { GameObjectTypeEnum, PositionEnum, SpriteResolutionEnum } from '../enums';
import { UUID } from './frameworkTypes';
import { InspectionData, Sprite, SpriteSet, Lock } from './gameBaseTypes';

type HasId = {
  id: UUID | string,
}

type HasPosition = {
  position: PositionEnum,
}

type BaseGameObject = HasId & HasPosition & {}

type HasSprite = {
  spriteResolution: SpriteResolutionEnum,
}

type IsInspectable = {
  inspectionData: InspectionData,
}

export type DynamicGameObject = {
  type: GameObjectTypeEnum,
  object: InspectableObject | PickableObject | ContainerObject | MovableCoverObject
}

export type Wall = HasId & {
  color: string,
  exit: null | ExitObject,
  pickables: PickableObject[],
  inspectables: InspectableObject[],
  containers: ContainerObject[],
  movableCovers: MovableCoverObject[],
}

export type ExitObject = IsInspectable & HasSprite & HasId & {
  lock: Lock,
  sprite: SpriteSet,
}

export type PickableObject = BaseGameObject & HasSprite & IsInspectable & {
  reusable: boolean,
  taken: boolean
}

export type InspectableObject = BaseGameObject & HasSprite & IsInspectable & {}

export type ContainerObject = BaseGameObject & HasSprite & IsInspectable & {
  content: DynamicGameObject[],
  lock: null | Lock
}

export type MovableCoverObject = BaseGameObject & HasSprite & IsInspectable & {
  content: DynamicGameObject
  used: boolean
}
