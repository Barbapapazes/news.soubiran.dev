if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .catch((error) => {
      console.warn('Failed to register the push notification service worker.', error)
    })
}
