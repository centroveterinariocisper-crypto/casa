// Despensa — service worker: sempre busca a versão nova; usa a cópia guardada só sem internet.
const VERSAO = 'despensa-v11';
const ARQUIVOS = ['./', './index.html', './manifest.webmanifest', './icone-m-192.png', './icone-m-512.png', './icone-m-180.png'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(VERSAO).then((c) => c.addAll(ARQUIVOS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSAO).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(fetch(req, { cache: 'no-store' }).then((res) => { if (res.ok) { const c = res.clone(); caches.open(VERSAO).then((x) => x.put(req, c)); } return res; }).catch(() => caches.match(req, { ignoreSearch: true }).then((r) => r || caches.match('./index.html'))));
});
