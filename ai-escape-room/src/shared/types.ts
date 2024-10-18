import { GameDisplayAreas } from "./enums";

export type PositionCalculatorInput = {
  area: GameDisplayAreas;
  screenSettings: {
    width: number,
    height: number,
    perspective: number
  }
};