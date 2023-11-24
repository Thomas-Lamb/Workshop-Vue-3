const cacheName = 'QuickMaint';
const assets = '/filelist.js';
const version = 1;
let filesToCache = [];

let socket;
let connexions = 0;

/**
 * Event : install
 * Description : Install service worker manage, use directly new service worker
 **/
self.addEventListener("install", (event) => {
    console.log("quickmaint-sw - install");
    event.waitUntil(
        precacheAssets(),
        // precacheMainData()
    );
});

/**
 * Event : activate
 * Description : Refresh storage cache
 **/
self.addEventListener("activate", (event) => {
    console.log("quickmaint-sw - activate");
    event.waitUntil(
        self.clients.claim(),
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== cacheName + "-v" + version) {
                        //delete all old caches or else new version of service worker won't get installed
                        return caches.delete(cache);
                    }
                }),
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
    console.log("quickmaint-sw - fetch " + event.request.url)
    console.log(event.request)
    const url = new URL(event.request.url);
    switch (event.request.method) {
        case "GET":
            event.respondWith((async () => {

                const cachedResponse = await caches.match(event.request);
                if (cachedResponse) {
                    console.log("--- Response from caches for : " + event.request.url)
                    return cachedResponse;
                }

                if(navigator.onLine) {
                    const response = await fetch(event.request);

                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        console.log("--- Response from website for : " + event.request.url)
                        if (url.pathname === "/api/main_data") {
                            const cache = await caches.open(cacheName + "-v" + version);
                            await cache.put(event.request, response.clone());
                        }
                        return response;
                    }
                    return response;
                } else {
                    console.log("Mode Offline")
                    return null
                }
            })());
            break;
        case "POST":
        case "PUT":
        case "DELETE":
            //storeRequest(event.request)
            break;
    }
});

/**
 * Name : precacheAssets
 * Description : Precache assets from server
 * Not used for the moment...
 */
function precacheAssets() {
    //this files contains all static resources of a react application
    fetch(assets, { method: "get" }).then((response) => {
        Promise.resolve(response.json()).then((json) => {
            var ary = []
            Object.keys(json).forEach(function (key) {
                ary.push(json[key]);
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
}

/**
 * Name : precacheMainData
 * Description : Precache call api main_data (translations and mix_config)
 * Not used for the moment...
 */
function precacheMainData() {
    //this files contains all static resources of a react application
    const myRequest = new Request("/api/main_data", {
        credentials: 'same-origin',
        mode: "cors",
        Accept: "application/json"
    })
    const response = fetch(myRequest);
    console.log(response)
    const cache = caches.open(cacheName + "-v" + version);
    cache.put(myRequest, response.clone());
}

/**
 *
 * @param request
 * @returns {Promise<void>}
 */
async function storeRequest(request) {
    new Promise(function (resolve, _) {
        let openRequest = indexedDB.open("quickmaint", 4);
        openRequest.onsuccess = function (event) {
            const db = event.target.result;
            const txn = db.transaction("requests", "readwrite");
            txn.oncomplete = function () {
                db.close();
            };
            resolve(true)
        };
    })
}