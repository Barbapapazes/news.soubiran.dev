import { postPushNotificationSubscription } from '@/app/api'

// Update the web push subscription when the app starts to make sure it's always valid and up to date, especially if the key has changed. This is important to ensure that the user continues to receive push notifications without interruption.
navigator.serviceWorker.ready.then((registration) => {
  // Check if the user has granted permission for notifications
  if (Notification.permission !== 'granted') {
    return
  }

  // Get the existing subscription and update it if necessary
  registration.pushManager.getSubscription().then((subscription) => {
    if (subscription) {
      // Send the subscription to the server to update it
      postPushNotificationSubscription(subscription.toJSON())
        .catch((error) => {
          console.error('Failed to update push subscription:', error)
        })
    }
  })
})
