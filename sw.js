/* =====================================
   LAUNDRY LAND V5
   SERVICE WORKER
===================================== */


const CACHE_NAME = "laundry-land-v5-cache";


const FILES_TO_CACHE = [

    "./",

    "./index.html",

    "./style.css",

    "./db.js",

    "./app.js",

    "./backup.js",

    "./manifest.json"

];




// ================================
// INSTALL
// ================================


self.addEventListener(
"install",
event=>{


event.waitUntil(

caches.open(
CACHE_NAME
)

.then(cache=>{


return cache.addAll(
FILES_TO_CACHE
);


})


);


self.skipWaiting();


});







// ================================
// ACTIVATE
// ================================


self.addEventListener(
"activate",
event=>{


event.waitUntil(


caches.keys()

.then(
keys=>{


return Promise.all(

keys.map(
key=>{


if(
key !== CACHE_NAME
){

return caches.delete(
key
);

}


}

)

);


}


)


);


self.clients.claim();


});







// ================================
// FETCH
// ================================


self.addEventListener(
"fetch",
event=>{


event.respondWith(


caches.match(
event.request
)

.then(
response=>{


return response ||

fetch(
event.request
);


}

)


);


});