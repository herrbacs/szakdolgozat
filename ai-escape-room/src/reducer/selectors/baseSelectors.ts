import { AppSettings } from "../../shared/types/frameworkTypes"
import { Dimension } from "../../shared/types/gameBaseTypes"
import { Wall } from "../../shared/types/gameObjectTypes"

export const selectGameInformation = (state: AppSettings) =>
  state.gameInformation

export const selectIndexes = (state: AppSettings) =>
  state.gameInformation.indexes

export const selectWalls = (state: AppSettings): Wall[] =>
  state.gameInformation.walls

export const selecScreenDimension = (state: AppSettings): Dimension =>
  state.screenSettings.dimension