import type { ForestObstacle } from "@/lib/forestWildlife";

/** One pausable scene clock for wildlife and the final-section discovery. */
export type ForestFrame = {
  elapsed: number;
  width: number;
  height: number;
  journey: number;
  paused: boolean;
  reading: boolean;
  menuOpen: boolean;
  obstacles: ForestObstacle[];
};

const listeners = new Set<(frame: ForestFrame) => void>();

export function subscribeForestFrame(listener: (frame: ForestFrame) => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export function publishForestFrame(frame: ForestFrame) {
  for (const listener of listeners) listener(frame);
}
