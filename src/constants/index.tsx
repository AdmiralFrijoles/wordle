export const IS_DEVELOPMENT = (process.env.NODE_ENV === "development");
export const APP_VERSION = IS_DEVELOPMENT ? "0.0.0-local" : "%%APP_VERSION%%";
export const APP_RELEASE_DATE = IS_DEVELOPMENT ? "2024-01-01" : "%%APP_RELEASE_DATE%%";

export const REVEAL_TIME_MS = 350;

