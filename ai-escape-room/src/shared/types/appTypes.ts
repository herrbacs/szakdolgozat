import { Sprite } from "pixi.js";
import { PositionEnum } from "../enums";
import { InspectableObject, PickableObject, Wall } from "./gameObjectTypes";
import { Dimension } from "./gameBaseTypes";
import { Coordinate } from "./frameworkTypes";

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
}

export type PositionCalculatorInput = {
  area: PositionEnum,
  screenSettings: ScreenSettings,
  sprite: Sprite,
  scale: number,
  perspective: boolean
};

export type ScreenSettings = {
	dimension: Dimension,
	perspective: number,
}

export type LevelInformation = {
	walls: Wall[],
}

export type Square = {
	topLeft: Coordinate,
	topRight: Coordinate,
	bottomRight: Coordinate,
	bottomLeft: Coordinate,
	pivot: Coordinate,
}
