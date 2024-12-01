"use client";

import {useEffect} from "react";

export function ServiceWorker() {
    //const [isSupported, setIsSupported] = useState(false);

    useEffect(() => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            //setIsSupported(true)
            registerServiceWorker()
        }
    }, [])

    async function registerServiceWorker() {
        await navigator.serviceWorker.register('/sw.js', {
            scope: '/',
            updateViaCache: 'none',
        });
    }

    return null;
}
