import { SetAppSettingsActionEnum } from "../shared/enums"
import { AppSettings, ReducerAction } from "../shared/types/frameworkTypes"
import { Wall } from "../shared/types/gameObjectTypes"
import { handleMove, loadLevel, toggleInventory, exit } from "./reducerController"

export const initialState : AppSettings = {
  screenSettings: {
    dimension: {
      width: 1280,
      height: 720,
    },
    perspective: 150,
  },
  gameInformation: {
    indexes: {
      currentWall: 0,
      leftWall: 0,
      rightWall: 1,
    },
    amountOfWalls: 0,
    walls: [],
    currentWall: {} as Wall,
    inventory: [],
    selectedItem: null,
    showInventory: false,
    inspectingItem: null,
  }
}

export const reducer = (state: AppSettings, { action, payload }: ReducerAction) => {
  switch (action) {
    case SetAppSettingsActionEnum.LOAD_LEVEL:
      return loadLevel(state, payload)
    case SetAppSettingsActionEnum.MOVE:
      return handleMove(state, payload)
      case SetAppSettingsActionEnum.TOGGLE_INVENTORY:
        return toggleInventory(state)
    // case SetAppSettingsActionEnum.PICK_UP_ITEM:
    //   return addItemToInventory(state, payload)
    // case SetAppSettingsActionEnum.SELECT_ITEM:
    //   return selectItemFromInventory(state, payload)
    // case SetAppSettingsActionEnum.UNSELECT_ITEM:
    //   return unselectItemFromInventory(state)
    // case SetAppSettingsActionEnum.DESTROY_INVENTORY_ITEM:
    //   return destroyItemFromInventory(state, payload)
    case SetAppSettingsActionEnum.EXIT:
      return exit(state)
    // case SetAppSettingsActionEnum.TOGGLE_OBJECT_INSPECTING:
    //   return toggleObjetInspecting(state, payload)
    // case SetAppSettingsActionEnum.DESTROY_PAINTING:
    //   return destroyPainting(state, payload)
    default:
      return state
  }
}