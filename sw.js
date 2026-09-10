// 子言的考研空间 - Service Worker (PWA 离线缓存)
const CACHE_NAME = 'ziyan-final-v2';
const ASSETS = [
  './',
  './index.html',
  './pwa.json',
  './assets/app-icon-192.png',
  './assets/app-icon-512.png',
  './assets/app-touch-icon.png',
  './assets/avatar.jpg',
  './assets/hero-bg-1.jpg',
  './assets/hero-bg-2.jpg',
  './assets/hero-bg-3.jpg',
  './_shared/js/echarts.min.js'
];

// 安装：预缓存核心资源
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

// 激活：清理所有旧缓存
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// 请求拦截
self.addEventListener('fetch', (e) => {
  var req = e.request;

  if (req.method !== 'GET') return;

  var url = new URL(req.url);

  // 跳过跨域请求
  if (url.origin !== self.location.origin) return;

  // manifest/pwa.json 永远走网络，不缓存
  if (url.pathname.endsWith('pwa.json') || url.pathname.endsWith('manifest.json')) {
    e.respondWith(fetch(req).catch(() => caches.match(req)));
    return;
  }

  e.respondWith(
    caches.match(req).then((cached) => {
      if (cached) {
        fetch(req).then((res) => {
          if (res && res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          }
        }).catch(() => {});
        return cached;
      }
      return fetch(req).then((res) => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
        return res;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
