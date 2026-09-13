# /*

LAUNDRY MANAGER PWA
SERVICE WORKER
VERSION: V3 FINAL
=================

*/

const CACHE_NAME = 'laundry-manager-v3.0.1';

const APP_SHELL = [
'./',
'./index.html',
'./style.css',
'./app.js',
'./manifest.json'
];

# /*

# INSTALL

*/

self.addEventListener('install', (event) => {

console.log('[Service Worker] Installing...');

event.waitUntil(
caches.open(CACHE_NAME)
.then((cache) => {

```
    console.log('[Service Worker] Caching App Shell');

    return cache.addAll(APP_SHELL);

  })
  .then(() => {

    return self.skipWaiting();

  })
```

);

});

# /*

ACTIVATE
MEMBERSIHKAN CACHE VERSI LAMA
=============================

*/

self.addEventListener('activate', (event) => {

console.log('[Service Worker] Activating...');

event.waitUntil(

```
caches.keys()
  .then((cacheNames) => {

    return Promise.all(

      cacheNames.map((cache) => {

        if (cache !== CACHE_NAME) {

          console.log(
            '[Service Worker] Delete Old Cache:',
            cache
          );

          return caches.delete(cache);

        }

      })

    );

  })
  .then(() => {

    return self.clients.claim();

  })
```

);

});

# /*

FETCH
STRATEGI:
NETWORK FIRST
FALLBACK CACHE
==============

*/

self.addEventListener('fetch', (event) => {

/*
Hanya request GET
*/

if (event.request.method !== 'GET') {

```
return;
```

}

/*
Jangan cache API eksternal
*/

const requestURL = new URL(event.request.url);

if (
requestURL.origin !== self.location.origin
) {

```
return;
```

}

event.respondWith(

```
fetch(event.request)

  .then((networkResponse) => {

    /*
    Validasi response
    */

    if (
      !networkResponse ||
      networkResponse.status !== 200 ||
      networkResponse.type !== 'basic'
    ) {

      return networkResponse;

    }


    /*
    Clone response
    */

    const responseClone =
      networkResponse.clone();


    /*
    Simpan ke cache
    */

    caches.open(CACHE_NAME)

      .then((cache) => {

        cache.put(
          event.request,
          responseClone
        );

      });


    return networkResponse;

  })


  /*
  Jika offline
  */

  .catch(() => {

    return caches.match(event.request)

      .then((cachedResponse) => {

        /*
        Jika tersedia cache
        */

        if (cachedResponse) {

          return cachedResponse;

        }


        /*
        Jika halaman tidak ditemukan
        */

        if (
          event.request.mode === 'navigate'
        ) {

          return caches.match(
            './index.html'
          );

        }


        /*
        Fallback kosong
        */

        return new Response(
          'Offline - Data tidak tersedia',
          {
            status: 503,
            statusText: 'Offline',
            headers: {
              'Content-Type':
                'text/plain'
            }
          }
        );

      });

  })
```

);

});

# /*

MESSAGE
UNTUK UPDATE PWA
================

*/

self.addEventListener(
'message',
(event) => {

```
if (
  event.data &&
  event.data.type === 'SKIP_WAITING'
) {

  self.skipWaiting();

}


/*
CLEAR CACHE MANUAL
*/

if (
  event.data &&
  event.data.type === 'CLEAR_CACHE'
) {

  caches.keys()

    .then((cacheNames) => {

      return Promise.all(

        cacheNames.map(
          (cacheName) =>
            caches.delete(cacheName)
        )

      );

    })

    .then(() => {

      console.log(
        '[Service Worker] Cache Cleared'
      );

    });

}
```

}
);

# /*

# SERVICE WORKER READY

*/

console.log(
'[Service Worker] Laundry Manager Ready'
);
