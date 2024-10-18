import { UUID } from 'crypto';
import { ExitStates, GameDisplayAreas, SetAppSettingsAction } from './enums';

export type AppSettingsContextType = {
	appSettings: AppStoreState,
	setAppSettings : any
}

export type AppStoreState = {
	screenSettings: ScreenSettings,
	navigation: Sprite,
	gameMeta: GameMetaInformation,
	game: {
		currentWallIndex: 0,
		leftWallIndex: 0,
		rightWallIndex: 0,
		amountOfWalls: 0,
	},
	levelInformation: levelInformation
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
	// Ez kb mappolva a levelInformation, csak itt már bekerülnek a  meta adatok és a képek is
}

export type GameMetaInformation = {
	currentWallIndex: number,
	leftWallIndex: number,
	rightWallIndex: number,
	amountOfWalls: number,
}

export type Sprite = {
	state?: ExitStates
	name: string
	width: number,
	height: number,
}

export type ScreenSettings = {
	width: number,
	height: number,
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