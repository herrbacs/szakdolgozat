import { MoveDirection } from '../shared/enums'

export function handleMove(state, payload) {
    let newWall = 0
    if (payload === MoveDirection.RIGHT) {
        newWall = (state.game.currentWall - 1) % (state.game.amountOfWalls)
    }

    if (payload === MoveDirection.LEFT) {
        newWall = (state.game.currentWall + 1) % (state.game.amountOfWalls)
    }

    return { ...state, game: { ...state.game, currentWall: newWall } }
}