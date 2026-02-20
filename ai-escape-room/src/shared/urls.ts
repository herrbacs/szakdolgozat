import { UUID } from "./types/frameworkTypes";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const loadLevelUrl = (levelId: UUID | string) =>
  `${API_BASE_URL}/level/${levelId}`;

export const spriteUrl = (levelId: UUID | string, spriteId: string | UUID) =>
  `${API_BASE_URL}/sprites/${levelId}/${spriteId}`;