import { ExitStates, MoveDirection } from '../shared/enums'
import { AppStoreState, GameInformation, levelInformation, PickableObject, Sprite } from '../shared/types'

export function loadLevel(state: AppStoreState, { walls }: levelInformation) : AppStoreState {
  return {
    ...state,
    gameInformation: { 
      ...state.gameInformation,
      indexes: {
        ...state.gameInformation.indexes,
        leftWall: walls.length - 1,
      },
      amountOfWalls: walls.length,
      walls,
    },
  }
}

export function handleMove(state: AppStoreState, payload: MoveDirection) : AppStoreState {
  let { amountOfWalls } = state.gameInformation
  let { currentWall } = state.gameInformation.indexes

  if (payload === MoveDirection.RIGHT) {
    currentWall = (currentWall - 1 + amountOfWalls) % amountOfWalls;
  }

  if (payload === MoveDirection.LEFT) {
    currentWall = (currentWall + 1) % amountOfWalls;
  }

  const rightWallIndex = (currentWall + 1) % amountOfWalls;
  const leftWallIndex = (currentWall - 1 + amountOfWalls) % amountOfWalls;

  const result = { 
    ...state,
    gameInformation: {
      ...state.gameInformation,
      indexes: {
        currentWall,
        leftWall: leftWallIndex,
        rightWall: rightWallIndex
      },
    }
  }

  return result
}

export function addItemToInventory(state: AppStoreState, payload: PickableObject) : AppStoreState {
	return {
		...state,
		gameInformation: {
			...state.gameInformation,
			inventory: [
				...state.gameInformation.inventory,
				payload
			]
		}
	}
}