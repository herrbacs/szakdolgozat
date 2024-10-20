import { SetAppSettingsAction } from "../shared/enums"
import { AppStoreState, ReducerAction } from "../shared/types"
import { handleMove, loadLevel } from "./reducerController"

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
    walls: []
  }
}

export const reducer = (state: AppStoreState, { action, payload }: ReducerAction) => {
  switch (action) {
    case SetAppSettingsAction.SET_LEVEL:
      return loadLevel(state, payload)
    case SetAppSettingsAction.MOVE:
      return handleMove(state, payload)
    default:
      return state
  }
}