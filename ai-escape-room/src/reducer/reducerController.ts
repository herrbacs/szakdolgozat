import { MoveDirectionEnum } from "../shared/enums";
import { LevelInformation } from "../shared/types/appTypes";
import { AppSettings } from "../shared/types/frameworkTypes";
import { PickableObject } from "../shared/types/gameObjectTypes";

export function loadLevel(state: AppSettings, { walls }: LevelInformation) : AppSettings {
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

export function handleMove(state: AppSettings, payload: MoveDirectionEnum) : AppSettings {
  let { amountOfWalls, walls } = state.gameInformation
  let { currentWall } = state.gameInformation.indexes

  if (payload === MoveDirectionEnum.LEFT) {
    currentWall = (currentWall - 1 + amountOfWalls) % amountOfWalls;
  }

  if (payload === MoveDirectionEnum.RIGHT) {
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

export function toggleInventory(state: AppSettings) : AppSettings {
  return {
		...state,
    gameInformation: {
      ...state.gameInformation,
      showInventory: !state.gameInformation.showInventory
    }
	}
}

export function addItemToInventory(state: AppSettings, payload: PickableObject) : AppSettings {
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

export function selectItemFromInventory(state: AppSettings, payload: PickableObject) : AppSettings {
	return {
		...state,
		gameInformation: {
			...state.gameInformation,
			selectedItem: payload
		}
	}
}

export function unselectItemFromInventory(state: AppSettings) : AppSettings {
	return {
		...state,
		gameInformation: {
			...state.gameInformation,
			selectedItem: null
		}
	}
}

export function destroyItemFromInventory(state: AppSettings, payload: PickableObject) : AppSettings {
	return {
		...state,
		gameInformation: {
			...state.gameInformation,
      inventory: state.gameInformation.inventory.filter(item => item.id !== payload.id)
		}
	}
}

export function exit(state: AppSettings) : AppSettings {
  let { gameInformation: { walls, indexes: { currentWall } } } = state

  walls[currentWall].exit!.lock.open = true

  return {
		...state
	}
}

// export function toggleObjetInspecting(state: AppSettings, payload: InspectableObject | null) : AppSettings {
//   return {
// 		...state,
//     gameInformation: {
//       ...state.gameInformation,
//       inspectingItem: payload
//     }
// 	}
// }

// export function destroyPainting(state: AppSettings, payload: InteractableObject) : AppSettings {
//   return {
// 		...state,
//     gameInformation: {
//       ...state.gameInformation,
//       walls: state.gameInformation.walls
//         .map((wall: Wall) => ({
//           ...wall,
//           interactables: wall.interactables.filter((interactable: InteractableObject) => interactable.id !== payload.id)
//         })),
//     }
// 	}
// }
