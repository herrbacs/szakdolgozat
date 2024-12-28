import { InspectableObjectTypes, InteractableObjectTypes } from "./enums";
import { InspectableObject, InteractableObject, PickableObject } from "./types";

export function base64ToBlob(base64: string, contentType: string) {
    const byteCharacters = atob(base64);
   	const byteNumbers = new Array(byteCharacters.length);
   	for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
   	}
   	const byteArray = new Uint8Array(byteNumbers);
   	return new Blob([byteArray], { type: contentType });
}

export function calculateScaleFactorOfInspectableObject(gameObject: InspectableObject) {
	switch (gameObject.type) {
		case InspectableObjectTypes.CLOCK:
			return 80 / gameObject.sprites[0].dimension.width;
	
		default:
			return 1;
	}
}

export function calculateScaleFactorOfInteractableObject(gameObject: InteractableObject): number {
	switch (gameObject.type) {
		case InteractableObjectTypes.PAINTING:
			return 150 / gameObject.sprites[0].dimension.width;
	
		default:
			return 1;
	}
}
