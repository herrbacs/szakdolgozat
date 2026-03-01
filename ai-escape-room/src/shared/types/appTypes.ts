import { PointData } from "pixi.js"
import { LockTypeEnum, PositionEnum } from "../enums"
import { DynamicGameObject, HasId, InspectableObject, PickableObject, Wall } from "./gameObjectTypes"
import { Dimension, InspectionData, Lock } from "./gameBaseTypes"
import { UUID } from "./frameworkTypes"

export type GameInformation = {
  indexes: {
    currentWall: number,
		leftWall: number,
		rightWall: number,
	}
	amountOfWalls: number
	walls: Wall[],
  derivation: Derivation[]
	inventory: PickableObject[],
	showInventory: boolean,
	selectedItem: null | PickableObject,
  notepad: Notepad,
	inspectingModal: null | inspectingModal,
	lockModal: null | LockModal,
	itemsFoundModal: null | DynamicGameObject[],
	cursorActions: CursorActions,
  showGameMenu: boolean,
  showLevelCompleteModal: boolean,
  levelId: UUID,
}

export type Derivation = {
  targetId: UUID | string,
  lockType: LockTypeEnum,
  expectedActivator: string,
  dependsOn: (UUID | string)[],
  playerHints: PlayerHint[]
}

export type Notepad = {
  content: string,
  visible: boolean,
}

export type PlayerHint = {
  hint: string,
  reveals: string
}

export type inspectingModal = InspectionData & HasId

export type CursorActions = {
  position: null | PointData
  examine: null | InspectionData & HasId,
  take: null | CursorAction,
  use: null | CursorAction,
  search: null | CursorAction,
}

export type CursorAction = {
  action: () => void
}

export type LockModal = {
  hints: PlayerHint[],
  parentObjectId: UUID | string,
  title: string,
  lock: Lock,
  openCallback: () => void
}

export type PositionCalculatorInput = {
  area: PositionEnum,
  screenSettings: ScreenSettings,
  // sprite: Sprite,
  // scale: number,
  // perspective: boolean
}

export type ScreenSettings = {
	dimension: Dimension,
	perspective: number,
}

export type LevelInformation = {
  story: string,
	walls: Wall[],
  derivation: Derivation[],
  id: UUID,
}

export type Square = {
	topLeft: PointData,
	topRight: PointData,
	bottomRight: PointData,
	bottomLeft: PointData,
	pivot: PointData,
}
