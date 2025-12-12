import { CursorActions } from "../shared/types/appTypes"

export const emptyCursorActions = (): CursorActions => ({
  position: null,
  examine: null,
  take: null,
  use: null,
  search: null,
})