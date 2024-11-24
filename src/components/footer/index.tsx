import {APP_VERSION, GIT_HASH, GITHUB_COMMIT_URL} from "@/constants";


export default function Footer() {
    return (
        <div className="flex justify-center items-center space-x-2 pb-1 pt-1">
            <p className="text-tiny text-gray-400 dark:text-slate-700">v{APP_VERSION}</p>
            <a className="text-tiny text-gray-400 dark:text-slate-700"
               href={GITHUB_COMMIT_URL} target="_blank" rel="noreferrer"
            >
                ({GIT_HASH})
            </a>
        </div>
    )
}