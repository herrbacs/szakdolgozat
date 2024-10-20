import { SetAppSettingsAction } from "../shared/enums"
import { AppStoreState, ReducerAction } from "../shared/types"
import { addItemToInventory, handleMove, loadLevel, selectItemFromInventory, unselectItemFromInventory } from "./reducerController"

export const initialState : AppStoreState = {
  screenSettings: {
    dimension: {
      width: 1280,
      height: 720,
    },
    perspective: 150,
  },
  navigation: {
    width: 109,
    height: 104
  },
  gameInformation: {
    indexes: {
      currentWall: 0,
      leftWall: 0,
      rightWall: 1,
    },
    amountOfWalls: 0,
    walls: [],
    inventory: [],
    selectedItem: null
  }
}

export const reducer = (state: AppStoreState, { action, payload }: ReducerAction) => {
  switch (action) {
    case SetAppSettingsAction.SET_LEVEL:
      return loadLevel(state, payload)
    case SetAppSettingsAction.MOVE:
      return handleMove(state, payload)
    case SetAppSettingsAction.PICK_UP_ITEM:
      return addItemToInventory(state, payload)
    case SetAppSettingsAction.SELECT_ITEM:
      return selectItemFromInventory(state, payload)
    case SetAppSettingsAction.UNSELECT_ITEM:
      return unselectItemFromInventory(state)
    default:
      return state
  }
}