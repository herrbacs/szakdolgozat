import { AppSettings } from "../shared/types/frameworkTypes"
import { Wall } from "../shared/types/gameObjectTypes"


/**
 * Base selectorok – csak olvasnak
 */
export const selectGameInformation = (state: AppSettings) =>
  state.gameInformation

export const selectIndexes = (state: AppSettings) =>
  state.gameInformation.indexes

export const selectWalls = (state: AppSettings): Wall[] =>
  state.gameInformation.walls
