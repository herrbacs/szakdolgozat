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
  const walls = state.gameInformation.walls.map(wall => {
    if (wall.id === state.gameInformation.walls[state.gameInformation.indexes.currentWall].id) {
      return {
        ...wall,
        pickables: wall.pickables.filter(pickable => pickable.id !== payload.id)
      }
    }

    return wall
  })

  return {
		...state,
		gameInformation: {
      ...state.gameInformation,
      walls,
			inventory: [
        ...state.gameInformation.inventory,
				payload
			],
		}
	}
}





export function selectItemFromInventory(state: AppStoreState, payload: PickableObject) : AppStoreState {
	return {
		...state,
		gameInformation: {
			...state.gameInformation,
			selectedItem: payload
		}
	}
}

export function unselectItemFromInventory(state: AppStoreState) : AppStoreState {
	return {
		...state,
		gameInformation: {
			...state.gameInformation,
			selectedItem: null
		}
	}
}

export function destroyItemFromInventory(state: AppStoreState, payload: PickableObject) : AppStoreState {
	return {
		...state,
		gameInformation: {
			...state.gameInformation,
      inventory: state.gameInformation.inventory.filter(item => item.id !== payload.id)
		}
	}
}