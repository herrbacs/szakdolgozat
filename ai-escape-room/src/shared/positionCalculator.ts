import { GameDisplayAreas } from "./enums";
import { Coordinate, PositionCalculatorInput, ScreenSettings, Sprite } from "./types";

export function setPositionOn({area, screenSettings, sprite, scale }: PositionCalculatorInput) : Coordinate {
  switch (area) {
    case GameDisplayAreas.FT2:
      return coordinatesOfFT2(screenSettings, sprite, scale);
    case GameDisplayAreas.WT1:
      return coordinatesOfWT1(screenSettings, sprite, scale);
    default:
      return { X: 0, Y: 0 }
  }
}

function coordinatesOfFT2(
  { perspective, dimension: { width, height }} : ScreenSettings,
  sprite : Sprite,
  scale: number
) : Coordinate {
  const offset = 35
  return {
    X: perspective + ((width - (perspective * 2)) / 2) - ((sprite.dimension.width * scale) / 2),
    Y: height - perspective + offset,
  }
}

function coordinatesOfWT1(
  { perspective, dimension: { width, height }} : ScreenSettings,
  sprite : Sprite,
  scale: number
) : Coordinate {

  return {
    X: perspective + ((width - (perspective * 2)) / 6),
    Y: perspective + (sprite.dimension.height * scale) / 2,
  }
}

function coordinatesOfWT2(
  { perspective, dimension: { width, height }} : ScreenSettings,
  sprite : Sprite,
  scale: number
) : Coordinate {

  return {
    X: perspective + ((width - (perspective * 2)) / 2),
    Y: perspective + (sprite.dimension.height * scale) / 2,
  }
}

function coordinatesOfWT3(
  { perspective, dimension: { width, height }} : ScreenSettings,
  sprite : Sprite,
  scale: number
) : Coordinate {

  return {
    X: perspective + (((width - (perspective * 2)) / 6) * 5),
    Y: perspective + (sprite.dimension.height * scale) / 2,
  }
}