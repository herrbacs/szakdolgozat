import { SetAppSettingsActionEnum } from "../enums"
import { GameInformation, ScreenSettings } from "./appTypes"
import { Dimension } from "./gameBaseTypes"

export type AppSettingsContextType = {
  appSettings: AppSettings,
  setAppSettings: any,
}

export type AppSettings = {
  screenSettings: ScreenSettings,
  gameInformation: GameInformation,
}

export type ReducerAction = {
  action: SetAppSettingsActionEnum,
  payload: any,
}
