import { SetAppSettingsAction } from "../shared/enums"
import { AppStoreState, ReducerAction } from "../shared/types"
import { handleMove } from "./reducerController"


export const initialState = {
  screen: {
    width: 1280,
    height: 720,
    offset: 150,
  },
  navigation: {
    width: 109,
    height: 104,
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