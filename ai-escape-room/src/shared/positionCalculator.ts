import { PointData, Sprite } from "pixi.js";
import { PositionEnum } from "./enums";
import { PositionCalculatorInput, ScreenSettings } from "./types/appTypes";

export function setPositionOn({area, screenSettings }: PositionCalculatorInput) : PointData {
  switch (area) {
    // Wall Top
    // case PositionEnum.WT1:
    //   return getWT1(screenSettings);
    // case PositionEnum.WT2:
    //   return getWT2(screenSettings);
    // case PositionEnum.WT3:
    //   return getWT3(screenSettings);

    // Wall
    // case PositionEnum.W1:
    //   return getW1(screenSettings);
    // case PositionEnum.W2:
    //   return getW2(screenSettings);
    // case PositionEnum.W3:
    //   return getW3(screenSettings);

    // Wall Bottom
    // case PositionEnum.WB1:
    //   return getWB1(screenSettings);
    // case PositionEnum.WB2:
    //   return getWB2(screenSettings);
    // case PositionEnum.WB3:
    //   return getWB3(screenSettings);

    // Floor
    case PositionEnum.F1:
      return getF1(screenSettings);
    // case PositionEnum.F2:
    //   return getF2(screenSettings);
    // case PositionEnum.F3:
    //   return getF3(screenSettings);

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

// Floor -----------------------------------------------------------
function getF1(
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

// Ezt lehet minden 1-2-3 hoz használni, egyelőre középre rakunk mindent
function calculateSectorY() {
    switch (area) {

    case 1:
      return getF1(screenSettings);

    default:
      return { x: 0, y: 0 }
  }
}
