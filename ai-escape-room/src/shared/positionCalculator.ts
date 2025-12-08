import { PointData, Sprite } from "pixi.js";
import { PositionEnum } from "./enums";
import { PositionCalculatorInput, ScreenSettings } from "./types/appTypes";

export function setPositionOn({ area, screenSettings }: PositionCalculatorInput): PointData {
  switch (area) {
    // Wall Top
    case PositionEnum.WT1:
      return {
        x: centerOfSectorX(0, screenSettings),
        y: centerOfSectorY('WT', screenSettings),
      }
    case PositionEnum.WT2:
      return {
        x: centerOfSectorX(1, screenSettings),
        y: centerOfSectorY('WT', screenSettings),
      }
    case PositionEnum.WT2:
      return {
        x: centerOfSectorX(2, screenSettings),
        y: centerOfSectorY('WT', screenSettings),
      }

    // Wall
    case PositionEnum.W1:
      return {
        x: centerOfSectorX(0, screenSettings),
        y: centerOfSectorY('W', screenSettings),
      }
    case PositionEnum.W2:
      return {
        x: centerOfSectorX(1, screenSettings),
        y: centerOfSectorY('W', screenSettings),
      }
    case PositionEnum.W2:
      return {
        x: centerOfSectorX(2, screenSettings),
        y: centerOfSectorY('W', screenSettings),
      }

    // Wall Bottom
    case PositionEnum.WB1:
      return {
        x: centerOfSectorX(0, screenSettings),
        y: centerOfSectorY('WB', screenSettings),
      }
    case PositionEnum.WB2:
      return {
        x: centerOfSectorX(1, screenSettings),
        y: centerOfSectorY('WB', screenSettings),
      }
    case PositionEnum.WB2:
      return {
        x: centerOfSectorX(2, screenSettings),
        y: centerOfSectorY('WB', screenSettings),
      }

    // Floor
    case PositionEnum.F1:
      return {
        x: centerOfSectorX(0, screenSettings),
        y: centerOfSectorY('F', screenSettings),
      }
    case PositionEnum.F2:
      return {
        x: centerOfSectorX(1, screenSettings),
        y: centerOfSectorY('F', screenSettings),
      }
    case PositionEnum.F2:
      return {
        x: centerOfSectorX(2, screenSettings),
        y: centerOfSectorY('F', screenSettings),
      }
    default:
      return { x: 0, y: 0 }
  }
}

function centerOfSectorX(sectorIndex: 0 | 1 | 2, { perspective, dimension: { width } }: ScreenSettings): number {
  const sectorUnitWidth = (width - 2 * perspective) / 3
  return perspective + (sectorUnitWidth * (sectorIndex + 0.5))
}

function centerOfSectorY(
  sector: 'F' | 'WB' | 'W' | 'WT',
  { perspective, dimension: { height } }: ScreenSettings
): number {
  const wallHeight = height - (2 * perspective)
  const height_WB_and_WT = (height / 6)
  const height_F = perspective / 3

  switch (sector) {
    case 'WT':
      return perspective + (height_WB_and_WT * .5)
    case 'W':
      return perspective + (height * .5)
    case 'WB':
      return perspective + wallHeight - (height_WB_and_WT * .5)
    case 'F':
      return perspective + wallHeight + height_F
    default:
      return 0
  }
}
