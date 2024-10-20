import { UUID } from 'crypto';
import { ExitStates, GameDisplayAreas, SetAppSettingsAction } from './enums';

export type AppSettingsContextType = {
	appSettings: AppStoreState,
	setAppSettings : any
}

export type AppStoreState = {
	screenSettings: ScreenSettings,
	navigation: Dimension,
	gameInformation: GameInformation
}

export type ReducerAction = {
	action: SetAppSettingsAction,
	payload: any
}

export type ExitObject = {
	keeyId: UUID,
	sprites: Sprite[]
}

export type PickableObject = {
	id: UUID,
	position: GameDisplayAreas
	name: string,
	sprite: Sprite
}

export type Wall = {
	color: string,
	exit?: ExitObject
	pickables: PickableObject[]
}

// Ez amit az api inputként add
export type levelInformation = {
	walls : Wall[]
}

export type GameInformation = {
	indexes: {
		currentWall: number,
		leftWall: number,
		rightWall: number,
	}
	amountOfWalls: number
	walls : Wall[]
	inventory: PickableObject[]
}

export type Dimension = {
	width: number,
	height: number,
}

export type Sprite = {
	name: string
	dimension: Dimension
	state: ExitStates
	blob: string
}

export type ScreenSettings = {
	dimension: Dimension,
	perspective: number,
}

// Other Types
export type PositionCalculatorInput = {
  area: GameDisplayAreas;
  screenSettings: ScreenSettings,
  sprite: Sprite,
  scale: number
};

export type Coordinate = {
	X: number,
	Y: number 
}