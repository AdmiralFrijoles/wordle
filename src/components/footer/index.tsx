import {APP_VERSION} from "@/constants";

export default function Footer() {
    return (
        <footer className="hidden justify-center px-6 pb-5 sm:flex">
            <p className="text-xs text-fg-muted">v{APP_VERSION}</p>
        </footer>
    )
}
