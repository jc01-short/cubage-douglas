const CACHE_NAME = 'cubage-douglas-pwa-v3';
const APP_FILES = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

async function hideHomeNewTreeButton(response) {
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) return response;

  let html = await response.text();
  const patch = `<style id="v161-home-patch">
    #home #goNewTree { display: none !important; }
  </style>`;

  if (!html.includes('v161-home-patch')) {
    html = html.replace('</head>', patch + '</head>');
  }

  return new Response(html, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers
  });
}

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const requestUrl = new URL(event.request.url);
  const isPage = event.request.mode === 'navigate' || requestUrl.pathname.endsWith('/index.html');

  if (isPage) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const cacheCopy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put('./index.html', cacheCopy));
          return hideHomeNewTreeButton(response);
        })
        .catch(async () => {
          const cached = await caches.match('./index.html');
          return cached ? hideHomeNewTreeButton(cached) : Response.error();
        })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
      return response;
    }))
  );
});
