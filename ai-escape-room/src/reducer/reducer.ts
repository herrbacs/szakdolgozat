import { SetAppSettingsActionEnum } from "../shared/enums"
import { AppSettings, ReducerAction } from "../shared/types/frameworkTypes"
import { Wall } from "../shared/types/gameObjectTypes"
import {
  handleMove,
  loadLevel,
  toggleInventory,
  exit,
  addItemToInventory,
  selectItemFromInventory,
  unselectItemFromInventory,
  destroyItemFromInventory,
  toggleObjetInspecting,
  removeCover,
  setLockModal,
  openContainer,
  searchContainer,
  emptyFoundItems,
  takeFoundItems,
} from "./reducerController"

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
    lockModal: null,
    itemsFoundModal: null
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
    case SetAppSettingsActionEnum.PICK_UP_ITEM:
      return addItemToInventory(state, payload)
    case SetAppSettingsActionEnum.SELECT_ITEM:
      return selectItemFromInventory(state, payload)
    case SetAppSettingsActionEnum.UNSELECT_ITEM:
      return unselectItemFromInventory(state)
    case SetAppSettingsActionEnum.DESTROY_INVENTORY_ITEM:
      return destroyItemFromInventory(state, payload)
    case SetAppSettingsActionEnum.EXIT:
      return exit(state)
    case SetAppSettingsActionEnum.TOGGLE_OBJECT_INSPECTING:
      return toggleObjetInspecting(state, payload)
    case SetAppSettingsActionEnum.REMOVE_COVER:
      return removeCover(state, payload)
    case SetAppSettingsActionEnum.SET_LOCK_MODAL:
      return setLockModal(state, payload)
    case SetAppSettingsActionEnum.CONTAINER_OPEN:
      return openContainer(state, payload)
    case SetAppSettingsActionEnum.CONTAINER_SEARCH:
      return searchContainer(state, payload)
    case SetAppSettingsActionEnum.EMPTY_FOUD_ITEMS_MODAL:
      return emptyFoundItems(state)
    case SetAppSettingsActionEnum.TAKE_FOUND_ITEMS:
      return takeFoundItems(state)
    default:
      return state
  }
}