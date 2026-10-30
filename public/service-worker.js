const APP_VERSION = "26.09.28.001";
const ASSETS_CACHE = `ProdemyAssets-v${APP_VERSION}`;
const DB_NAME = "ProdemyDB";
const DB_VERSION = 1;
const PRODEMY_DATA = "ProdemyData";
const API_URL = "https://lxp-dev.prodemy.id";

async function cacheCoreAssets() {
  const cache = await caches.open(ASSETS_CACHE);
  return await cache.addAll([
    "/",
    "/courses",
    "/favicon.ico",
    "/logo.png",
    "/pro.png",
  ]);
}

self.addEventListener("install", (event) => {
  console.log('[SW] Installing version:', APP_VERSION);
  event.waitUntil(cacheCoreAssets());
  self.skipWaiting();
});

async function clearOldCaches() {
  const cacheNames = await caches.keys();
  return await Promise.all(
    cacheNames
      .filter((name) => name.startsWith('ProdemyAssets-') && name !== ASSETS_CACHE)
      .map((name_1) => {
        console.log('[SW] Deleting old cache:', name_1);
        return caches.delete(name_1);
      })
  );
}

console.log('[SW] Activating version:', APP_VERSION);
self.addEventListener("activate", (event) => {
  event.waitUntil(clearOldCaches());
  self.clients.claim();
});

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore(PRODEMY_DATA, { keyPath: "url" });
    };
  });
}

// save data when online
async function addData(url, jsonData) {
  const db = await openDb();
  const transaction = db.transaction(PRODEMY_DATA, "readwrite");
  const store = transaction.objectStore(PRODEMY_DATA);

  const data = {
    url,
    response: JSON.stringify(jsonData),
  };

  await new Promise((resolve, reject) => {
    const request = store.put(data);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// get data from indexed db
async function getData(url) {
  try {
    const db = await openDb();
    const transaction = db.transaction(PRODEMY_DATA, "readonly");
    const store = transaction.objectStore(PRODEMY_DATA);

    const result = await new Promise((resolve, reject) => {
      const request = store.get(url);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    if (result && result.response) {
      return JSON.parse(result.response);
    }

    return null;
  } catch (error) {
    console.error("Error retrieving from IndexedDB:", error);
    return null;
  }
}

async function cacheFirstStrategy(request) {
  try {
    const cache = await caches.open(ASSETS_CACHE);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    const responseClone = networkResponse.clone();
    await cache.put(request, responseClone);
    return networkResponse;
  } catch (error) {
    console.error("Cache first strategy failed:", error);
    return null;
  }
}

async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const responseClone = networkResponse.clone();
      const responseData = await responseClone.json();
      await addData(request.url, responseData);
      return networkResponse;
    }

    throw new Error("Network response was not ok");
  } catch (error) {
    console.error("Network first strategy failed:", error);
    const cachedResponse = await getData(request.url);

    if (cachedResponse) {
      return new Response(JSON.stringify(cachedResponse), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return null;
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.origin === API_URL) {
    event.respondWith(networkFirstStrategy(request));
  } else {
    event.respondWith(cacheFirstStrategy(request));
  }
});
