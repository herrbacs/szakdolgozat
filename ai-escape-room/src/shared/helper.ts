import { InspectableObjectTypes } from "./enums";
import { InspectableObject, PickableObject } from "./types";

export function base64ToBlob(base64: string, contentType: string) {
    const byteCharacters = atob(base64);
   	const byteNumbers = new Array(byteCharacters.length);
   	for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
   	}
   	const byteArray = new Uint8Array(byteNumbers);
   	return new Blob([byteArray], { type: contentType });
}

// Ha nem szobában van hanem valami megtekintendő helyen, akkor lehetne egy plusz type kapcsolót megadni a parent objectből, és az alapján állítjuk be a cél méretet
export function calculateScaleFactorOfInspectableObject(gameObject: InspectableObject) {
	switch (gameObject.type) {
		case InspectableObjectTypes.CLOCK:
			return 85 / gameObject.sprites[0].dimension.width;
	
		default:
			return 1;
	}
}
