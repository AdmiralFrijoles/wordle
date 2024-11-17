// ts-ignore 7017 is used to ignore the error that the global object is not
// defined in the global scope. This is because the global object is only
// defined in the global scope in Node.js and not in the browser.
import Keyv from "keyv";
import KeyvRedis from "@keyv/redis";

const globalForKeyv = global as unknown as { keyv: Keyv }

const useRedis = process.env.REDIS_URL !== undefined;

function create() {
    const opt = {
        namespace: "wordle",
        ttl: 5000
    }

    if (useRedis) {
        return new Keyv(new KeyvRedis({
            url: process.env.REDIS_URL,
            database: parseInt(process.env.REDIS_DATABASE ?? "0")
        }), opt);
    } else {
        return new Keyv(opt);
    }
}

export const keyv = globalForKeyv.keyv || create();

if (process.env.NODE_ENV !== 'production') globalForKeyv.keyv = keyv

export default keyv