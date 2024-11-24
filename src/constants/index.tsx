export const IS_DEVELOPMENT = (process.env.NODE_ENV === "development");
export const APP_VERSION = IS_DEVELOPMENT ? "0.0.0-local" : "%%APP_VERSION%%";
export const GIT_HASH = IS_DEVELOPMENT ? "91be332" : "%%GIT_HASH%%";
export const GITHUB_COMMIT_URL = `https://github.com/AdmiralFrijoles/wordle/commit/${GIT_HASH}`

export const REVEAL_TIME_MS = 350;

