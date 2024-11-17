"use server";

import prisma from "./prisma"
import {AppSetting} from "@prisma/client";
import {fetchFromCache, invalidateCache} from "@/lib/cache";

export interface IAppSetting<T> {
    key: string;
    default?: T | null;
    ttl?: number;
    cacheNulls?: boolean;
}

// 6 hours
const defaultTTL: number = 1000 * 60 * 60 * 6;

const getCacheKey = (key: string): string => `app-setting-${key}`;

export async function getAppSetting<T>(setting: IAppSetting<T> | string): Promise<T | null> {
    const settingData = typeof setting === "string" ? {key: setting} : setting;
    const cacheKey = getCacheKey(settingData.key);
    return fetchFromCache<T>(
        cacheKey,
        async () => {
            const appSetting: AppSetting | null | undefined = await prisma.appSetting.findUnique({where: {key: settingData.key}});
            if (appSetting && appSetting.value)
                return JSON.parse(appSetting.value) as T;
            return settingData.default ?? null;
        },
        settingData.ttl ?? defaultTTL,
        settingData.cacheNulls ?? false
    );
}

export async function setAppSetting<T>(setting: IAppSetting<T> | string, value: T | null): Promise<void> {
    const settingKey = typeof setting === "string" ? setting : setting.key;
    const cacheKey = getCacheKey(settingKey);
    await prisma.appSetting.upsert({
        where: {key: settingKey},
        update: {value: JSON.stringify(value)},
        create: {key: settingKey, value: JSON.stringify(value)}
    });
    await invalidateCache(cacheKey);
}
