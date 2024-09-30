import { SetAppSettingsAction } from "../shared/enums"
import { handleMove } from "./reducerController"

export const initialState = {
  screen: {
    width: 1280,
    height: 1024
  },
  navigationIconDimension: {
    width: 109,
    height: 104,
  },
  game: {
    currentWall: 0,
    amountOfWalls: 0
  },
  levelInformation: {
    walls: []
  }
}
  
export const reducer = (state, { action, payload }) => {
  switch (action) {
    case SetAppSettingsAction.SET_LEVEL:
      return { ...state, game: { ...state.game, amountOfWalls: payload.walls.length }, levelInformation: payload }
      case SetAppSettingsAction.MOVE:
        return handleMove(state, payload)
    default:
      return state
  }
}