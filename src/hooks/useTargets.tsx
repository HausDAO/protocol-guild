import { TARGETS, TARGET } from "../targetDao";

export const useTargets = (): TARGET => {
  return TARGETS[import.meta.env.VITE_TARGET_KEY || "TEST"];
};
