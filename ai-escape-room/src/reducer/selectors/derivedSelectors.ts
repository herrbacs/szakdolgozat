import { AppSettings } from "../../shared/types/frameworkTypes"
import { Wall } from "../../shared/types/gameObjectTypes"
import * as baseSelectors from "../selector"

export const selectCurrentWallIndex = (state: AppSettings): number =>
  baseSelectors.selectIndexes(state).currentWall

export const selectCurrentWall = (state: AppSettings): Wall | null => {
  const walls = baseSelectors.selectWalls(state)
  const index = selectCurrentWallIndex(state)

  return walls[index] ?? null
}

export const selectLeftWallIndex = (state: AppSettings): number =>
  baseSelectors.selectIndexes(state).leftWall

export const selectRightWallIndex = (state: AppSettings): number =>
  baseSelectors.selectIndexes(state).rightWall
