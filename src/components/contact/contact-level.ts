import type { ContactTargetId } from "@constants";

export const WORLD_WIDTH = 1680;

export type CollectiblePlacement = {
  id: ContactTargetId;
  /** 0–1 horizontal position in the world */
  xRatio: number;
  /** 0–1 vertical position in the world */
  yRatio: number;
  size: number;
};

/** Icons scattered across the full play area */
export const COLLECTIBLE_PLACEMENTS: CollectiblePlacement[] = [
  { id: "person", xRatio: 0.1, yRatio: 0.78, size: 108 },
  { id: "medal", xRatio: 0.24, yRatio: 0.14, size: 108 },
  { id: "building", xRatio: 0.4, yRatio: 0.62, size: 114 },
  { id: "phone", xRatio: 0.56, yRatio: 0.22, size: 108 },
  { id: "letter", xRatio: 0.72, yRatio: 0.84, size: 108 },
  { id: "github", xRatio: 0.9, yRatio: 0.38, size: 114 },
];

export const SPAWN_RATIO = { x: 0.5, y: 0.5 };

export type ResolvedCollectible = {
  id: ContactTargetId;
  x: number;
  y: number;
  size: number;
};

export function resolveCollectibles(worldHeight: number): ResolvedCollectible[] {
  return COLLECTIBLE_PLACEMENTS.map((item) => ({
    id: item.id,
    x: item.xRatio * WORLD_WIDTH,
    y: item.yRatio * worldHeight,
    size: item.size,
  }));
}

export function resolveSpawn(worldHeight: number) {
  return {
    x: SPAWN_RATIO.x * WORLD_WIDTH,
    y: SPAWN_RATIO.y * worldHeight,
  };
}

export type MushroomPlacement = {
  xRatio: number;
  yRatio: number;
  size: number;
};

export type ResolvedMushroom = {
  x: number;
  y: number;
  size: number;
};

/** Decorative mushrooms — smaller than contact icons */
export const MUSHROOM_PLACEMENTS: MushroomPlacement[] = [
  { xRatio: 0.12, yRatio: 0.32, size: 52 },
  { xRatio: 0.33, yRatio: 0.86, size: 48 },
  { xRatio: 0.55, yRatio: 0.52, size: 50 },
  { xRatio: 0.74, yRatio: 0.16, size: 52 },
  { xRatio: 0.93, yRatio: 0.68, size: 48 },
];

export function resolveMushrooms(worldHeight: number): ResolvedMushroom[] {
  return MUSHROOM_PLACEMENTS.map((item) => ({
    x: item.xRatio * WORLD_WIDTH,
    y: item.yRatio * worldHeight,
    size: item.size,
  }));
}
