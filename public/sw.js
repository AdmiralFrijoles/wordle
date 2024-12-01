const version = "%%APP_VERSION%%" // increase for new version
const staticCacheName = version + "_pwa-static";
const dynamicCacheName = version + "_pwa-dynamic";

self.addEventListener('install', function() {
    console.log('Installing ServiceWorker and cache static assets');
    self.skipWaiting();
})

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(cacheName) {
                    if (!cacheName.startsWith(staticCacheName) &&
                        !cacheName.startsWith(dynamicCacheName)) {
                        return true;
                    }
                }).map(function(cacheName) {
                    // completely deregister for ios to get changes too
                    console.log('deregistering Serviceworker')
                    if ('serviceWorker' in navigator) {
                        navigator.serviceWorker.getRegistrations().then(function(registrations) {
                            registrations.map(r => {
                                r.unregister()
                            })
                        })
                        window.location.reload()
                    }

                    console.log('Removing old cache.', cacheName);
                    return caches.delete(cacheName);
                })
            );
        })
    );
});