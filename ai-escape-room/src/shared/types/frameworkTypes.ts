import { SetAppSettingsActionEnum } from "../enums"
import { GameInformation, ScreenSettings } from "./appTypes"
import { Dimension } from "./gameBaseTypes"

export type AppSettingsContextType = {
  appSettings: AppSettings,
  setAppSettings: any,
}

export type AppSettings = {
  screenSettings: ScreenSettings,
  navigation: Dimension,
  gameInformation: GameInformation,
}

export type ReducerAction = {
  action: SetAppSettingsActionEnum,
  payload: any,
}

export type Coordinate = {
	X: number,
	Y: number,
}
