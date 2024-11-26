import cache from "@/lib/keyv";
import {decode, encode} from "@msgpack/msgpack";

function serialize<T>(data: T): Uint8Array {
    const encoded = encode<T>(data);
    return Buffer.from(encoded.buffer, encoded.byteOffset, encoded.byteLength);
}

function deserialize<T>(data: Uint8Array): T | undefined {
    try {
        return decode<T>(data) as T | undefined;
    } catch (e) {
        console.error(e, `[Cache][deserialize]: Failed to deserialize data: `, data);
    }
}

export async function fetchFromCache<T>(
    key: string,
    fetcher: () => Promise<T | null>,
    ttl: number | undefined = undefined,
    cacheNulls: boolean = false
): Promise<T | null> {
    const cachedEncodedValue: Uint8Array | undefined | null = await cache.get<Uint8Array>(key);
    if (cachedEncodedValue === undefined) {
        await cache.delete(key);
    }
    if (cachedEncodedValue) {
        const cached = deserialize<T>(cachedEncodedValue);
        if (cached) {
            return cached;
        }
    }

    const result = await fetcher();
    if (result || cacheNulls) {
        const serialized = serialize(result);
        await cache.set<Uint8Array>(key, serialized, ttl);
    }

    return result;
}

export async function invalidateCache(key: string): Promise<void> {
    await cache.delete(key);
}