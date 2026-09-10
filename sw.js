// 子言的考研空间 - Service Worker (PWA 离线缓存)
const CACHE_NAME = 'ziyan-final-v6';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/app-icon-192.png',
  './assets/app-icon-512.png',
  './assets/app-touch-icon.png',
  './assets/apple-touch-icon.png',
  './assets/scut-seal-new.jpg',
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

// 监听消息 - 允许强制跳过等待
self.addEventListener('message', (e) => {
  if (e.data === 'skipWaiting') {
    self.skipWaiting();
  }
});

// 激活：清理所有旧缓存，强制接管
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// 请求拦截 - 网络优先策略
self.addEventListener('fetch', (e) => {
  var req = e.request;

  if (req.method !== 'GET') return;

  var url = new URL(req.url);

  // 跳过跨域请求
  if (url.origin !== self.location.origin) return;

  // HTML 文件：永远网络优先，确保拿到最新版本
  if (req.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname === '/' || url.pathname.endsWith('/')) {
    e.respondWith(
      fetch(req).then((res) => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
        return res;
      }).catch(() => caches.match(req).then((cached) => cached || caches.match('./index.html')))
    );
    return;
  }

  // manifest 永远走网络，不缓存
  if (url.pathname.endsWith('manifest.webmanifest') || url.pathname.endsWith('manifest.json') || url.pathname.endsWith('pwa.json')) {
    e.respondWith(fetch(req).catch(() => caches.match(req)));
    return;
  }

  // 其他资源：缓存优先，后台更新
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
