import { PointData, Sprite } from "pixi.js";
import { PositionEnum } from "../enums";
import { InspectableObject, PickableObject, Wall } from "./gameObjectTypes";
import { Dimension, Lock } from "./gameBaseTypes";

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
};

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
