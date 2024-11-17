import {IAppSetting} from "@/lib/settings-service";

export const SETTING_APP_TITLE: IAppSetting<string> = {key: "APP_TITLE", default: "Wordle"}
export const SETTING_APP_DESCRIPTION: IAppSetting<string> = {key: "APP_DESCRIPTION", default: "A word guessing game"}

export const SETTING_DEFAULT_PUZZLE: IAppSetting<string> = {key: "DEFAULT_PUZZLE_SLUG"};

