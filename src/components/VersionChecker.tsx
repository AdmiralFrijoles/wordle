"use client";

import {APP_VERSION} from "@/constants";
import {useGlobalModal} from "@/providers/GlobalModalProvider";

export function VersionChecker() {
    const changelogModal = useGlobalModal("changelog");
    const lastVersionSeen = localStorage.getItem("last-version");
    if (lastVersionSeen !== APP_VERSION) {
        localStorage.setItem("last-version", APP_VERSION);
        if (changelogModal) {
            setTimeout(() => changelogModal.onOpen(), 2000);
        }
    }

    return null;
}