import { Sprite } from "pixi.js";
import { PositionEnum } from "./enums";
import { PositionCalculatorInput, ScreenSettings } from "./types/appTypes";
import { Coordinate } from "./types/frameworkTypes";

export function setPositionOn({area, screenSettings, sprite, scale, perspective }: PositionCalculatorInput) : Coordinate {
  
  switch (area) {
    // WT
    // case PositionEnum.WT1:
    //   return coordinatesOfWT1(screenSettings, sprite, scale, perspective);
    // case PositionEnum.WT2:
    //   return coordinatesOfWT2(screenSettings, sprite, scale);
    // case PositionEnum.WT3:
    //   return coordinatesOfWT3(screenSettings, sprite, scale, perspective);
    // // W
    // case PositionEnum.W1:
    //   return coordinatesOfW1(screenSettings, sprite, scale, perspective);
    // case PositionEnum.W2:
    //   return coordinatesOfW2(screenSettings, sprite, scale);
    // case PositionEnum.W3:
    //   return coordinatesOfW3(screenSettings, sprite, scale, perspective);
    // // FT
    // case PositionEnum.FT2:
    //   return coordinatesOfFT2(screenSettings, sprite, scale);
    default:
      return { X: 0, Y: 0 }
  }
}

// WT -----------------------------------------------------------
// function coordinatesOfWT1(
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

// function coordinatesOfWT2(
//   { perspective, dimension: { width }} : ScreenSettings,
//   sprite : Sprite,
//   scale: number
// ) : Coordinate {

//   return {
//     X: perspective + ((width - (perspective * 2)) / 2),
//     Y: perspective + (sprite.dimension.height * scale) / 2,
//   }
// }

// function coordinatesOfWT3(
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
// function coordinatesOfW1(
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

// function coordinatesOfW2(
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

// function coordinatesOfW3(
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
// function coordinatesOfFT2(
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
