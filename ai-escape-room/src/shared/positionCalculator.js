import { GameDisplayAreas } from "./enums";

export function getCornerCoordinatesOf(zone) {
    switch (zone) {
        case GameDisplayAreas.FT2:
            return getCornerCoordinatesOfFT2();
    
        default:
            break;
    }

}

const getCornerCoordinatesOfFT2 = () => {

}