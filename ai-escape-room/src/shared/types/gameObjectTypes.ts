import { UUID } from 'crypto';
import { GameObjectTypeEnum, PositionEnum } from '../enums';
import { InspectionData, Sprite, SpriteSet } from './gameBaseTypes';

type HasId = {
  id: UUID,
}

type HasPosition = {
  position: PositionEnum,
}

type BaseGameObject = HasId & HasPosition & {}

type HasSprite = {
  sprite: Sprite,
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

export type ExitObject = {
  lock: Lock,
  sprite: SpriteSet,
}

export type PickableObject = BaseGameObject & HasSprite & IsInspectable & {
  reusable: boolean,
}

export type InspectableObject = BaseGameObject & HasSprite & IsInspectable & {}

export type ContainerObject = BaseGameObject & HasSprite & IsInspectable & {
  content: DynamicGameObject[],
  Lock: null | Lock
}

export type MovableCoverObject = BaseGameObject & HasSprite & IsInspectable & {
  content: DynamicGameObject
}
