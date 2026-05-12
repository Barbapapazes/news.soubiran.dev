<script lang="ts">
import { useQuery } from '@pinia/colada'
import { isSubscribedQuery, preferencesQuery } from '@/app/queries/push-notifications'
import { userQuery } from '@/app/queries/user'

const pushNotificationsModal = tv({
  slots: {
    base: '',
  },
})

export interface PushNotificationsModalProps {
  class?: any
  ui?: Partial<typeof pushNotificationsModal.slots>
}
export interface PushNotificationsModalEmits {
  close: [void]
}
export interface PushNotificationsModalSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<PushNotificationsModalProps>()
defineEmits<PushNotificationsModalEmits>()
defineSlots<PushNotificationsModalSlots>()

const title = 'Notifications'

const loginUrl = `${import.meta.env.VITE_BASE_API_URL}/login`

const { state: userState } = useQuery(userQuery())

const { state: preferencesState } = useQuery(preferencesQuery())

const loading = computed(() => {
  return userState.value.status === 'pending' || preferencesState.value.status === 'pending'
})

const { data } = useQuery(isSubscribedQuery())
const isSubscribed = computed(() => {
  if (data.value) {
    return data.value.isSubscribed
  }

  return false
})

const ui = computed(() => pushNotificationsModal())
</script>

<template>
  <UModal
    :title="title"
    :close="{
      size: 'sm',
    }"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
    :ui="{
      content: 'divide-none',
      header: 'sm:px-4 sm:pt-4 pb-0 min-h-auto',
      body: 'sm:p-4 text-toned',
      footer: 'sm:px-4 sm:pb-4 pt-0 justify-end',
      close: 'top-2 end-2',
    }"
  >
    <template #body>
      <template v-if="loading">
        <p>
          Loading…
        </p>
      </template>

      <template v-else-if="userState.status === 'error'">
        <p>
          To enable push notifications, you first need to log in.
        </p>

        <div class="mt-4">
          <UButton
            label="Log In"
            :to="loginUrl"
            color="primary"
            block
          />
        </div>
      </template>

      <template v-else>
        <PushNotificationsSubscriptionForm v-if="!isSubscribed" />

        <PushNotificationsPreferencesForm
          v-else
          :preferences="preferencesState.data?.preferences?.preferences || []"
        />
      </template>
    </template>
  </UModal>
</template>
