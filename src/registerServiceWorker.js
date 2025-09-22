if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/src/service-worker.js')
      .then(reg => console.log('SW registered', reg.scope))
      .catch(err => console.error('SW register failed', err))
  })
}
