import keyv from "@/lib/keyv";

export async function fetchFromCache<T>(
    key: string,
    fetcher: () => Promise<T | null>,
    ttl: number | undefined = undefined,
    cacheNulls: boolean = false
): Promise<T | null> {
    const cached: T | undefined | null = await keyv.get<T>(key);
    if (cached) return cached;

    const result = await fetcher();

    if (result || cacheNulls)
        await keyv.set(key, result, ttl);

    return result;
}

export async function invalidateCache(key: string): Promise<void> {
    await keyv.delete(key);
}