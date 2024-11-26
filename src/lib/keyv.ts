import Keyv, {KeyvOptions} from "keyv";
import KeyvRedis from "@keyv/redis";
import {Cacheable} from 'cacheable';
const useRedis = process.env.REDIS_URL !== undefined;

function create(): Cacheable {
    const opt: KeyvOptions = {
        namespace: "wordle",
        ttl: 5000
    }

    if (useRedis) {
        const secondary = new Keyv(new KeyvRedis({
            url: process.env.REDIS_URL,
            database: parseInt(process.env.REDIS_DATABASE ?? "0"),
        }), opt);
        return new Cacheable({
            secondary,
            nonBlocking: true,
            namespace: opt.namespace,
            ttl: opt.ttl
        });
    } else {
        return new Cacheable({
            namespace: opt.namespace,
            ttl: opt.ttl
        });
    }
}

export const cache = create();
export default cache;