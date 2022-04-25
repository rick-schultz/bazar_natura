'use strict';

const CACHE_NAME = "Bazar_Natura_estatico";

const FILES_CACHE = [

    "css/bootstrap.min.css",
    "css/styles.css",
    "img/bg1.jpg",
    "img/bg2.jpg",
    "img/bg3.jpg",
    "img/logo.png",
    "js/app.js",
    "js/bootstrap.bundle.min.js",
    "offline.html"

];

//Instalar Service Worker
self.addEventListener("install", (evt) => {

    evt.waitUntil(

        caches.open(CACHE_NAME).then((cache) => {

            console.log("Service Worker gravando o cache estático.");
            return cache.addAll(FILES_CACHE);

        })

    );
    self.skipWaiting();

});

//Ativar Service Worker
self.addEventListener("activate", (evt) => {

    evt.waitUntil(

        caches.keys().then((keylist) => {

            return Promise.all(keylist.map((key) => {
                if(key !== CACHE_NAME){
                    return caches.delete(key);
                }
            }));

        })

    );
    self.clients.claim();
});

//Responder Off-line

self.addEventListener("fetch", (evt) => {

    if(evt.request.mode !== "navigate"){
        return;
    }

    evt.respondWith(
        fetch(evt.request).catch(()=>{
            return caches.open(CACHE_NAME).then((cache) =>{

                return cache.match("offline.html");
            });

        })
    );

});