<script lang="ts">
import { useMutation, useQueryCache } from '@pinia/colada'
import { prose } from '@soubiran/ui/wrapper-classes'
import { postPushNotificationSubscription } from '@/app/api'
import { PUSH_NOTIFICATIONS_QUERY_KEYS } from '@/app/queries/push-notifications'

const pushNotificationsSubscriptionForm = tv({
  slots: {
    base: 'space-y-4',
  },
})

export interface PushNotificationsSubscriptionFormProps {
  class?: any
  ui?: Partial<typeof pushNotificationsSubscriptionForm.slots>
}
export interface PushNotificationsSubscriptionFormEmits {}
export interface PushNotificationsSubscriptionFormSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<PushNotificationsSubscriptionFormProps>()
defineEmits<PushNotificationsSubscriptionFormEmits>()
defineSlots<PushNotificationsSubscriptionFormSlots>()

const queryCache = useQueryCache()
const { mutate, error, isLoading } = useMutation({
  mutation: ({ subscription }: { subscription: PushSubscriptionJSON }) => postPushNotificationSubscription(subscription),
  onSettled: () => {
    queryCache.invalidateQueries({ key: PUSH_NOTIFICATIONS_QUERY_KEYS.root })
  },
})

const notificationPermission = ref(Notification.permission)
async function enableNotifications() {
  notificationPermission.value = Notification.permission === 'granted' ? 'granted' : await Notification.requestPermission()

  if (notificationPermission.value !== 'granted') {
    return
  }

  const registration = await navigator.serviceWorker.ready
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: decodeVapidPublicKey(import.meta.env.VITE_VAPID_PUBLIC_KEY),
  })

  mutate({
    subscription: subscription.toJSON(),
  })
}

const isNotificationsDenied = computed(() => notificationPermission.value === 'denied')

const ui = computed(() => pushNotificationsSubscriptionForm())
</script>

<template>
  <div :class="ui.base({ class: props.ui?.base })">
    <UAlert
      v-if="error"
      color="error"
      variant="subtle"
      title="Unable to enable notifications"
      description="Something went wrong while enabling notifications."
    />

    <UAlert
      v-if="isNotificationsDenied"
      color="warning"
      variant="subtle"
      title="Notifications Blocked"
      description="You have blocked notifications for this site. Please enable them in your browser settings to receive updates."
    />

    <div :class="prose.join(' ')">
      <p>
        Enabling push notifications will allow you to receive notifications about new news and updates directly on your device, even when you're not actively browsing the website.
      </p>

      <p>
        Once enabled, you'll be able to choose which notifications you want to receive.
      </p>
    </div>

    <UButton
      label="Enable Notifications"
      block
      :loading="isLoading"
      :disabled="isNotificationsDenied"
      @click="enableNotifications"
    />
  </div>
</template>
