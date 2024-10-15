import { MoveDirection } from '../shared/enums'

export function handleMove(state, payload) {
    let { amountOfWalls, currentWallIndex } = state.game;

    if (payload === MoveDirection.RIGHT) {
        currentWallIndex = (currentWallIndex - 1 + amountOfWalls) % amountOfWalls;
    }
    
    if (payload === MoveDirection.LEFT) {
        currentWallIndex = (currentWallIndex + 1) % amountOfWalls;
    }
    
    const rightWallIndex = (currentWallIndex + 1) % amountOfWalls;
    const leftWallIndex = (currentWallIndex - 1 + amountOfWalls) % amountOfWalls;

    return { ...state, game: { ...state.game, currentWallIndex, leftWallIndex, rightWallIndex } }
}