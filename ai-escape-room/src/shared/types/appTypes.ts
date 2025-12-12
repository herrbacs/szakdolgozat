import { PointData } from "pixi.js"
import { PositionEnum } from "../enums"
import { DynamicGameObject, InspectableObject, PickableObject, Wall } from "./gameObjectTypes"
import { Dimension, Lock } from "./gameBaseTypes"

export type GameInformation = {
	indexes: {
		currentWall: number,
		leftWall: number,
		rightWall: number,
	}
	amountOfWalls: number
	currentWall: Wall,
	walls: Wall[],
	inventory: PickableObject[],
	showInventory: boolean,
	selectedItem: null | PickableObject,
	inspectingItem: null | InspectableObject,
	lockModal: null | LockModal,
	itemsFoundModal: null | DynamicGameObject[],
	cursorActions: CursorActions,
}

export type CursorActions = {
  position: null | PointData
  examine: null | CursorAction,
  take: null | CursorAction,
  use: null | CursorAction,
  search: null | CursorAction,
}

export type CursorAction = {
  action: () => void
}

export type LockModal = {
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
	walls: Wall[],
}

export type Square = {
	topLeft: PointData,
	topRight: PointData,
	bottomRight: PointData,
	bottomLeft: PointData,
	pivot: PointData,
}
