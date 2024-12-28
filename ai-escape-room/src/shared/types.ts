import { UUID } from 'crypto';
import { ExitStates, GameDisplayAreas, InspectableObjectSpriteStates, InspectableObjectTypes, InteractableObjectSpriteStates, InteractableObjectTypes, SetAppSettingsAction, SpritePerspective, TypeName } from './enums';

export type AppSettingsContextType = {
	appSettings: AppStoreState,
	setAppSettings: any,
}

export type AppStoreState = {
	screenSettings: ScreenSettings,
	navigation: Dimension,
	gameInformation: GameInformation,
}

export type ReducerAction = {
	action: SetAppSettingsAction,
	payload: any,
}

export type ExitObject = {
	keeyId: UUID,
	state: ExitStates.CLOSED | ExitStates.OPEN,
	sprites: Sprite[],
}

type BaseGameObject = {
	id: UUID,
	position: GameDisplayAreas,
}

export type PickableObject = BaseGameObject & {
	name: string,
	sprite: Sprite,
	reusable: boolean,
}

export type InspectableObject = BaseGameObject & {
	text: string,
	sprites: Sprite[],
	type: InspectableObjectTypes,
}

export type InteractableObject = BaseGameObject & {
	type: InteractableObjectTypes,
	sprites: Sprite[],
	holds: {
		pickable: PickableObject | null,
		inspectable: InspectableObject | null,
	},
}

export type Wall = {
	id: UUID,
	color: string,
	exit?: ExitObject,
	pickables: PickableObject[],
	inspectables: InspectableObject[],
	interactables: InteractableObject[],
}

export type levelInformation = {
	walls: Wall[],
}

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

export type Dimension = {
	width: number,
	height: number,
}

export type Sprite = {
	name: string,
	dimension: Dimension,
	state: ExitStates | InspectableObjectSpriteStates | InteractableObjectSpriteStates,
	perspective: undefined | {
		right: Sprite,
		left: Sprite,
	},
	blob: string,
}

export type ScreenSettings = {
	dimension: Dimension,
	perspective: number,
}

export type PositionCalculatorInput = {
  area: GameDisplayAreas,
  screenSettings: ScreenSettings,
  sprite: Sprite,
  scale: number,
  perspective: boolean
};

export type Coordinate = {
	X: number,
	Y: number,
}

export type Square = {
	topLeft: Coordinate,
	topRight: Coordinate,
	bottomRight: Coordinate,
	bottomLeft: Coordinate,
	pivot: Coordinate,
}
