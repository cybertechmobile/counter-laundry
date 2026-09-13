/* =========================================================
   LAUNDRY MANAGER PWA
   SERVICE WORKER
   VERSION 4.0.0
========================================================= */

"use strict";


/* =========================================================
   CACHE CONFIG
========================================================= */

const CACHE_NAME = "laundry-manager-v4";

const APP_FILES = [

  "./",

  "./index.html",

  "./style.css",

  "./app.js",

  "./manifest.json",

  "./icons/icon-192.png",

  "./icons/icon-512.png"

];


/* =========================================================
   INSTALL
========================================================= */

self.addEventListener(
  "install",
  event => {

    console.log(
      "[Service Worker] Installing..."
    );

    event.waitUntil(

      caches.open(CACHE_NAME)

        .then(cache => {

          console.log(
            "[Service Worker] Caching files"
          );

          return cache.addAll(
            APP_FILES
          );

        })

        .then(() => {

          return self.skipWaiting();

        })

    );

  }
);


/* =========================================================
   ACTIVATE
========================================================= */

self.addEventListener(
  "activate",
  event => {

    console.log(
      "[Service Worker] Activating..."
    );

    event.waitUntil(

      caches.keys()

        .then(cacheNames => {

          return Promise.all(

            cacheNames.map(cacheName => {

              if (
                cacheName !== CACHE_NAME
              ) {

                console.log(
                  "[Service Worker] Removing old cache:",
                  cacheName
                );

                return caches.delete(
                  cacheName
                );
              }

            })

          );

        })

        .then(() => {

          return self.clients.claim();

        })

    );

  }
);


/* =========================================================
   FETCH
========================================================= */

self.addEventListener(
  "fetch",
  event => {

    /*
      Hanya menangani GET request
    */

    if (
      event.request.method !== "GET"
    ) {

      return;
    }


    /*
      Cache First Strategy

      1. Cari dari cache
      2. Jika tidak ada → Internet
      3. Jika internet berhasil
         simpan ke cache
    */

    event.respondWith(

      caches.match(
        event.request
      )

        .then(cachedResponse => {

          /*
            FILE SUDAH ADA
            DI CACHE
          */

          if (cachedResponse) {

            return cachedResponse;
          }


          /*
            FILE BELUM ADA
            COBA INTERNET
          */

          return fetch(
            event.request
          )

            .then(networkResponse => {

              /*
                Pastikan response valid
              */

              if (

                !networkResponse

                ||

                networkResponse.status !== 200

                ||

                networkResponse.type !== "basic"

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

              caches.open(
                CACHE_NAME
              )

                .then(cache => {

                  cache.put(
                    event.request,
                    responseClone
                  );

                });


              return networkResponse;

            })

            .catch(() => {

              /*
                OFFLINE FALLBACK
              */

              if (

                event.request.mode
                === "navigate"

              ) {

                return caches.match(
                  "./index.html"
                );
              }


              return new Response(

                "Offline",

                {

                  status: 503,

                  statusText:
                    "Offline"

                }

              );

            });

        })

    );

  }
);


/* =========================================================
   MESSAGE
========================================================= */

self.addEventListener(
  "message",
  event => {

    if (

      event.data

      &&

      event.data.type
      === "SKIP_WAITING"

    ) {

      self.skipWaiting();

    }

  }
);


/* =========================================================
   BACKGROUND READY
========================================================= */

console.log(
  "Laundry Manager Service Worker Ready"
);