import { UUID } from "crypto";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const loadLevelUrl = (levelId: UUID) =>
  `${API_BASE_URL}/level/${levelId}`;

export const spriteUrl = (levelId: UUID, spriteId: string | UUID) =>
  `${API_BASE_URL}/sprites/${levelId}/${spriteId}`;