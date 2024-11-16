// @ts-expect-error any
import * as wordExists from "word-exists";

export default function isValidWord(word: string): boolean {
    return wordExists(word);
};