const cacheName = 'QuickMaint';
const assets = '/quickmaint/caches';
const version = 1;
let filesToCache = [];

/**
 * Event : install
 * Description : Install service worker manage, use directly new service worker
 **/
self.addEventListener("install", (event) => {

    if (checkLocalHost(event.request)) {
        event.waitUntil(
            console.log("quickmaint-sw - install for localhost"),
            caches.open(cacheName + "-v" + version).then((cache) =>
                cache.addAll(filesToCache)
            )
        );
    } else {
        event.waitUntil(
            console.log("quickmaint-sw - install with network"),
            precacheAssets()
        );
    }
});


/**
 * Event : activate
 * Description : Refresh storage cache
 **/
self.addEventListener("activate", (event) => {


    event.waitUntil(
        console.log("quickmaint-sw - activate"),
        self.clients.claim(),
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    console.log(cache)
                    if (cache !== cacheName + "-v" + version) {
                        //delete all old caches or else new version of service worker won't get installed
                        return caches.delete(cache);
                    }
                })
            );
        }),
    );
});

/**
 * Event : fetch
 * Description : Display online page or offline page
 * @return {Promise}
 * */
self.addEventListener("fetch", (event) => {
    console.log("quickmaint-sw - fetch ")
    if (event.request.method === 'GET' && event.request.url.includes('/quickmaint/')) {
        event.respondWith((async () => {
            const cachedResponse = await caches.match(event.request);
            if (cachedResponse) {
                return cachedResponse;
            }
            const response = await fetch(event.request);
            if (!response || response.status !== 200 || response.type !== 'basic') {
                const cache = await caches.open(cacheName + "-v" + version);
                await cache.put(event.request, response.clone());
                return response;
            }
            return response;
        })());
    }
});


/**
 * Name : checkLocalHost
 * Description : Check if application is launch from localhost or not
 * @param {*} request
 * @returns
 */
function checkLocalHost(request) {
    let localhost = new RegExp("^https?:\\/\\/localhost", "i");
    if(request && request.referrer && localhost.test(request.referrer)) {
        filesToCache = ['/favicon.ico'];
        return true;
    }
    return false;
}

/**
 * Name : precacheAssets
 * Description : Precache assets from server
 */
function precacheAssets() {
    //this files contains all static resources of a react application
    fetch(assets, { method: "get" }).then((response) => {
        let promise = Promise.resolve(response.text()).then((text) => {
            filesToCache = JSON.parse(text);
            var ary = []
            Object.keys(filesToCache).forEach(function (key) {
                if (!filesToCache[key].endsWith('.map'))
                    ary.push(filesToCache[key]);
            });

            caches.open(cacheName + "-v" + version).then(function (cache) {
                return cache.addAll(
                    ary.map(url => new Request(url, {
                        credentials: 'same-origin'
                    }))
                );
            })
        })
    })
};
