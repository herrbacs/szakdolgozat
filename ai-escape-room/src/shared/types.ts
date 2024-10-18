import { UUID } from 'crypto';
import { ExitStates, GameDisplayAreas, SetAppSettingsAction } from './enums';

export type AppSettingsContextType = {
	appSettings: AppStoreState,
	setAppSettings : any
}

export type AppStoreState = {
	screen: ScreenSettings,
	navigation: Sprite,
	gameMeta: GameMetaInformation
	game: {

	}
}

export type ReducerAction = {
	action: SetAppSettingsAction,
	payload: any
}

// Game Object Types
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

export type GameObject = {
	exit: ExitObject
	pickables: PickableObject[]
}

export type Wall = {
	color: string,
	objects: GameObject[]
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
	state: undefined | ExitStates
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
  screenSetting: ScreenSettings
};