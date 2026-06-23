// Service Worker — APP UNIEDU PWA
// Propósito: habilitar instalação como app (Add to Home Screen).
//
// Sem cache. Sem interceptação de requisições.
// O Vite e a Vercel gerenciam o cache de assets via HTTP headers.
// Novos deploys são carregados automaticamente — sem risco de cache antigo preso.

self.addEventListener('install', () => {
  // Ativa imediatamente, sem aguardar o fechamento de abas abertas
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Assume controle das abas abertas sem necessidade de reload
  event.waitUntil(self.clients.claim());
});
