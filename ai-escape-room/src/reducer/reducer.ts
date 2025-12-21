import { SetAppSettingsActionEnum } from "../shared/enums"
import { AppSettings, ReducerAction } from "../shared/types/frameworkTypes"
import {
  moveAround,
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
  setCursorActions,
  moveTo,
  toggleNotepad,
  updateNotepad,
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
    notepad: {
      content: '',
      visible: false,
    },
    indexes: {
      currentWall: 0,
      leftWall: 0,
      rightWall: 1,
    },
    amountOfWalls: 0,
    walls: [],
    inventory: [],
    selectedItem: null,
    showInventory: false,
    inspectingModal: null,
    lockModal: null,
    itemsFoundModal: null,
    cursorActions: {
      position: null,
      examine: null,
      take: null,
      use: null,
      search: null,
    }
  }
}

export const reducer = (state: AppSettings, { action, payload }: ReducerAction) => {
  switch (action) {
    case SetAppSettingsActionEnum.LOAD_LEVEL:
      return loadLevel(state, payload)
    case SetAppSettingsActionEnum.MOVE_AROUND:
      return moveAround(state, payload)
    case SetAppSettingsActionEnum.TOGGLE_NOTEPAD:
      return toggleNotepad(state)
    case SetAppSettingsActionEnum.UPDATE_NOTEPAD:
      return updateNotepad(state, payload)
    case SetAppSettingsActionEnum.MOVE_TO:
      return moveTo(state, payload)
    case SetAppSettingsActionEnum.SET_CURSOR_ACTIONS:
      return setCursorActions(state, payload)
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