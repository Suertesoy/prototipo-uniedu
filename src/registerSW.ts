// Registro do Service Worker — APP UNIEDU PWA
// Chamado uma vez no main.tsx. Não interfere em rotas, providers ou estado da aplicação.

export function registerServiceWorker(): void {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[PWA] Service Worker registrado:', registration.scope);
        })
        .catch((error) => {
          console.warn('[PWA] Falha ao registrar Service Worker:', error);
        });
    });
  }
}
