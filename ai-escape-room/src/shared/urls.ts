import { UUID } from "./types/frameworkTypes";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const SOCKET_BASE_URL = import.meta.env.VITE_SOCKET_BASE_URL ?? "http://localhost:4000";

export const loadLevelUrl = (levelId: UUID | string) =>
  `${API_BASE_URL}/levels/load/${levelId}`;

export const spriteUrl = (levelId: UUID | string, spriteId: string | UUID) =>
  `${API_BASE_URL}/sprites/${levelId}/${spriteId}`;
