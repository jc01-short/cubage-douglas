const CACHE_NAME = 'cubage-douglas-pwa-v5';
const APP_FILES = [
  './',
  './index.html',
  './manifest.webmanifest',
  './delete-tree-patch.js',
  './delete-parcel-patch.js',
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

async function patchHtml(response) {
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) return response;

  let html = await response.text();

  if (!html.includes('v161-home-patch')) {
    html = html.replace(
      '</head>',
      '<style id="v161-home-patch">#home #goNewTree{display:none!important}</style></head>'
    );
  }
  if (!html.includes('delete-tree-patch.js')) {
    html = html.replace(
      '</body>',
      '<script src="./delete-tree-patch.js"></script></body>'
    );
  }
  if (!html.includes('delete-parcel-patch.js')) {
    html = html.replace(
      '</body>',
      '<script src="./delete-parcel-patch.js"></script></body>'
    );
  }

  return new Response(html, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers
  });
}

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  const isPage =
    event.request.mode === 'navigate' || url.pathname.endsWith('/index.html');

  if (isPage) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put('./index.html', copy));
          return patchHtml(response);
        })
        .catch(async () => {
          const cached = await caches.match('./index.html');
          return cached ? patchHtml(cached) : Response.error();
        })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached =>
      cached || fetch(event.request).then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        return response;
      })
    )
  );
});
