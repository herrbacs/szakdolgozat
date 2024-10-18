import { SetAppSettingsAction } from "../shared/enums"
import { AppStoreState, ReducerAction } from "../shared/types"
import { handleMove } from "./reducerController"

// export const initialState : AppStoreState = {
export const initialState = {
  screenSettings: {
    width: 1280,
    height: 720,
    perspective: 150,
  },
  navigation: {
    name: "Navigation",
    width: 109,
    height: 104
  },
  game: {
    currentWallIndex: 0,
    leftWallIndex: 0,
    rightWallIndex: 0,
    amountOfWalls: 0
  },
  levelInformation: {
    walls: []
  }
}

export const reducer = (state: AppStoreState, { action, payload }: ReducerAction) => {
  switch (action) {
    case SetAppSettingsAction.SET_LEVEL:
      return { ...state, game: { ...state.game, amountOfWalls: payload.walls.length, leftWallIndex: payload.walls.length - 1, rightWallIndex: 1 }, levelInformation: payload }
      case SetAppSettingsAction.MOVE:
        return handleMove(state, payload)
    default:
      return state
  }
}