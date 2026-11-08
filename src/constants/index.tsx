export const IS_DEVELOPMENT = (process.env.NODE_ENV === "development");
export const APP_VERSION = IS_DEVELOPMENT ? "0.0.0-local" : "%%APP_VERSION%%";
export const APP_RELEASE_DATE = IS_DEVELOPMENT ? "2024-01-01" : "%%APP_RELEASE_DATE%%";

// Gap between tiles starting their flip. Each flip lasts FLIP_DURATION_MS.
export const REVEAL_TIME_MS = 300;
export const FLIP_DURATION_MS = 600;
export const WIN_ANIMATION_MS = 1500;
export const LOSS_ANIMATION_MS = 2400;
export const LOSS_EXIT_MS = 300;

