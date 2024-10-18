import { GameDisplayAreas } from "./enums";
import { PositionCalculatorInput } from "./types";

export function getCornerCoordinatesOf({area}: PositionCalculatorInput) {
  switch (area) {
    case GameDisplayAreas.FT2:
      return "";

    default:
      break;
  }

}
