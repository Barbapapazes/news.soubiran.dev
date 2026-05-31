import { postPushNotificationSubscription } from '@/app/api'

function isPushNotificationsSupported() {
  return typeof window !== 'undefined'
    && window.isSecureContext
    && 'serviceWorker' in navigator
    && 'PushManager' in window
    && 'Notification' in window
    && import.meta.env.VITE_VAPID_PUBLIC_KEY.length > 0
}

function getExpectedApplicationServerKey() {
  return decodeVapidPublicKey(import.meta.env.VITE_VAPID_PUBLIC_KEY)
}

function areUint8ArraysEqual(left: Uint8Array, right: Uint8Array) {
  return left.length === right.length && left.every((value, index) => value === right[index])
}

function hasExpectedApplicationServerKey(subscription: PushSubscription) {
  const currentApplicationServerKey = subscription.options.applicationServerKey
  if (!currentApplicationServerKey) {
    return false
  }

  return areUint8ArraysEqual(
    new Uint8Array(currentApplicationServerKey),
    getExpectedApplicationServerKey(),
  )
}

export async function ensurePushSubscription() {
  if (!isPushNotificationsSupported() || Notification.permission !== 'granted') {
    return null
  }

  const registration = await navigator.serviceWorker.ready
  const currentSubscription = await registration.pushManager.getSubscription()

  if (currentSubscription && hasExpectedApplicationServerKey(currentSubscription)) {
    return currentSubscription
  }

  if (currentSubscription) {
    await currentSubscription.unsubscribe()
  }

  return registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: getExpectedApplicationServerKey(),
  })
}

export async function syncPushSubscription() {
  const subscription = await ensurePushSubscription()
  if (!subscription) {
    return null
  }

  await postPushNotificationSubscription(subscription.toJSON())

  return subscription
}
