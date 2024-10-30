import { ExitStates, MoveDirection } from '../shared/enums'
import { AppStoreState, InspectableObject, levelInformation, PickableObject } from '../shared/types'

export function loadLevel(state: AppStoreState, { walls }: levelInformation) : AppStoreState {
  return {
    ...state,
    gameInformation: { 
      ...state.gameInformation,
      currentWall: walls[0],
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
  let { amountOfWalls, walls } = state.gameInformation
  let { currentWall } = state.gameInformation.indexes

  if (payload === MoveDirection.RIGHT) {
    currentWall = (currentWall - 1 + amountOfWalls) % amountOfWalls;
  }

  if (payload === MoveDirection.LEFT) {
    currentWall = (currentWall + 1) % amountOfWalls;
  }

  const rightWallIndex = (currentWall + 1) % amountOfWalls;
  const leftWallIndex = (currentWall - 1 + amountOfWalls) % amountOfWalls;

  const currentWallObject = walls[Math.abs(currentWall)]

  const result = { 
    ...state,
    gameInformation: {
      ...state.gameInformation,
      currentWall: currentWallObject,
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
  let { gameInformation: { walls, currentWall } } = state

  walls.forEach(wall => {
    if (wall.id !== currentWall.id) {
      return
    }
    wall.pickables = wall.pickables.filter(pickable => pickable.id !== payload.id)
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

export function exit(state: AppStoreState) : AppStoreState {
  let { gameInformation: { walls } } = state
  
  walls.forEach(wall => {
    if (wall.exit === undefined) {
      return
    }
    wall.exit.state = ExitStates.OPEN
  })
  
  return {
		...state,
    gameInformation: {
      ...state.gameInformation,
      walls
    }
	}
}

export function toggleInventory(state: AppStoreState) : AppStoreState {
  return {
		...state,
    gameInformation: {
      ...state.gameInformation,
      showInventory: !state.gameInformation.showInventory
    }
	}
}

export function toggleObjetInspecting(state: AppStoreState, payload: InspectableObject | null) : AppStoreState {
  return {
		...state,
    gameInformation: {
      ...state.gameInformation,
      inspectingItem: payload
    }
	}
}
