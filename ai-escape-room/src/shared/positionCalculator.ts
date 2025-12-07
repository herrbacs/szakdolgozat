import { PointData, Sprite } from "pixi.js";
import { PositionEnum } from "./enums";
import { PositionCalculatorInput, ScreenSettings } from "./types/appTypes";

export function setPositionOn({area, screenSettings, scale, perspective }: PositionCalculatorInput) : PointData {
  switch (area) {
    // WT
    case PositionEnum.WT1:
      return getWT1(screenSettings, scale, perspective);
    case PositionEnum.WT2:
      return getWT2(screenSettings, scale);
    case PositionEnum.WT3:
      return getWT3(screenSettings, scale, perspective);

    // // W
    case PositionEnum.W1:
      return getW1(screenSettings, scale, perspective);
    case PositionEnum.W2:
      return getW2(screenSettings, scale);
    case PositionEnum.W3:
      return getW3(screenSettings, scale, perspective);

    // WB
    case PositionEnum.WB1:
      return getWB1(screenSettings, scale, perspective);
    case PositionEnum.WB2:
      return getWB2(screenSettings, scale);
    case PositionEnum.WB3:
      return getWB3(screenSettings, scale, perspective);

    // WB
    case PositionEnum.F1:
      return getF1(screenSettings, scale, perspective);
    case PositionEnum.F2:
      return getF2(screenSettings, scale);
    case PositionEnum.F3:
      return getF3(screenSettings, scale, perspective);

    default:
      return { x: 0, y: 0 }
  }
}

// WT -----------------------------------------------------------
// function getWT1(
//   { perspective, dimension: { width, height }} : ScreenSettings,
//   sprite : Sprite,
//   scale: number,
//   isPerspective: boolean,
// ) : Coordinate {

//   const wallHeight = (height - 2*perspective)

//   if (isPerspective) {
//     return {
//       X: (width - (perspective)) + (perspective  / 2),
//       Y: perspective,
//     }
//   }

//   return {
//     X: perspective + ((width - (perspective * 2)) / 6),
//     Y: perspective + (wallHeight / 9),
//   }
// }

// function getWT2(
//   { perspective, dimension: { width }} : ScreenSettings,
//   sprite : Sprite,
//   scale: number
// ) : Coordinate {

//   return {
//     X: perspective + ((width - (perspective * 2)) / 2),
//     Y: perspective + (sprite.dimension.height * scale) / 2,
//   }
// }

// function getWT3(
//   { perspective, dimension: { width }} : ScreenSettings,
//   sprite : Sprite,
//   scale: number,
//   isPerspective: boolean,
// ) : Coordinate {

//   return {
//     X: perspective + (((width - (perspective * 2)) / 6) * 5),
//     Y: perspective + (sprite.dimension.height * scale) / 2,
//   }
// }

// // W -----------------------------------------------------------
// function getW1(
//   { perspective, dimension: { width, height }} : ScreenSettings,
//   sprite : Sprite,
//   scale: number,
//   isPerspective: boolean,
// ) : Coordinate {
//   const wallHeight = (height - 2*perspective)

//   if (isPerspective) {
//     return {
//       X: (width - perspective) + (perspective  / 2),
//       Y: perspective + (wallHeight / 2),
//     }
//   }

//   return {
//     X: perspective + ((width - (perspective * 2)) / 6),
//     Y: perspective + (wallHeight / 2),
//   }
// }

// function getW2(
//   { perspective, dimension: { width, height }} : ScreenSettings,
//   sprite : Sprite,
//   scale: number,
// ) : Coordinate {
//   const wallHeight = (height - 2*perspective)

//   return {
//     X: perspective + ((width - (perspective * 2)) / 2),
//     Y: perspective + (wallHeight / 2),
//   }
// }

// function getW3(
//   { perspective, dimension: { width, height }} : ScreenSettings,
//   sprite : Sprite,
//   scale: number,
//   isPerspective: boolean,
// ) : Coordinate {
//   const wallHeight = (height - 2*perspective)

//   if (isPerspective) {
//     return {
//       X: perspective  / 2,
//       Y: perspective + (wallHeight / 2),
//     }
//   }

//   return {
//     X: perspective + (((width - (perspective * 2)) / 6) * 5),
//     Y: perspective + (wallHeight / 2),
//   }
// }

// // FT -----------------------------------------------------------
// function getFT2(
//   { perspective, dimension: { width, height }} : ScreenSettings,
//   sprite : Sprite,
//   scale: number
// ) : Coordinate {
//   const offset = 35
//   return {
//     X: perspective + ((width - (perspective * 2)) / 2) - ((sprite.dimension.width * scale) / 2),
//     Y: height - perspective + offset,
//   }
// }
