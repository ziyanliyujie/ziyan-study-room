// 子言的考研空间 - Service Worker (PWA 离线缓存)
const CACHE_NAME = 'ziyan-study-room-v8';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './assets/scut-logo.jpg',
  './assets/avatar.jpg',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/apple-touch-icon.png',
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

// 激活：清理旧缓存
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

  // 跳过非 GET 请求（POST/PATCH 用于云同步上传）
  if (req.method !== 'GET') return;

  var url = new URL(req.url);

  // 关键修复：跳过所有跨域 API 请求（GitHub Gist API 等），不缓存、不拦截
  if (url.origin !== self.location.origin) return;

  e.respondWith(
    caches.match(req).then((cached) => {
      if (cached) {
        // 缓存命中：后台同时更新缓存（stale-while-revalidate）
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
