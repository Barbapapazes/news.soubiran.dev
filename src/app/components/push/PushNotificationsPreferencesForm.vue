<script lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import type z from 'zod'
import { useMutation, useQuery, useQueryCache } from '@pinia/colada'
import { getUser, postPushNotificationPreferences } from '@/app/api'
import { PUSH_NOTIFICATIONS_QUERY_KEYS } from '@/app/queries/push-notifications'
import { USER_QUERY_KEYS } from '@/app/queries/user'
import { savePushNotificationsPreferencesSchema } from '@/shared/validators'

const pushNotificationsPreferencesForm = tv({
  slots: {
    base: 'space-y-4',
    actions: 'flex items-center justify-end gap-2',
    recentlySuccessful: 'text-muted text-sm',
  },
})

export interface PushNotificationsPreferencesFormProps {
  preferences: ('newNews' | 'dailyRecap' | 'weeklyRecap' | 'statusUpdates')[]
  class?: any
  ui?: Partial<typeof pushNotificationsPreferencesForm.slots>
}
export interface PushNotificationsPreferencesFormEmits {}
export interface PushNotificationsPreferencesFormSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<PushNotificationsPreferencesFormProps>()
defineEmits<PushNotificationsPreferencesFormEmits>()
defineSlots<PushNotificationsPreferencesFormSlots>()

const { data: userData } = useQuery({
  key: USER_QUERY_KEYS.root,
  query: getUser,
})

const schema = savePushNotificationsPreferencesSchema
type Schema = z.output<typeof schema>

const state = reactive<Schema>({
  preferences: props.preferences,
})

const queryCache = useQueryCache()
const { mutate, error, isLoading, recentlySuccessful } = useMutation({
  mutation: ({ preferences }: { preferences: string[] }) => postPushNotificationPreferences(preferences),
  onSettled: () => {
    queryCache.invalidateQueries({ key: PUSH_NOTIFICATIONS_QUERY_KEYS.root })
  },
})
async function onSubmit(event: FormSubmitEvent<Schema>) {
  mutate({
    preferences: event.data.preferences,
  })
}

const ui = computed(() => pushNotificationsPreferencesForm())
</script>

<template>
  <UForm
    :schema="schema"
    :state="state"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
    @submit="onSubmit"
  >
    <UAlert
      v-if="error"
      color="error"
      variant="subtle"
      title="Unable to Save Preferences"
      description="Something went wrong while saving your preferences."
    />

    <PushNotificationsPreferencesCheckboxGroup
      v-model="state.preferences"
      :discord-id="userData!.data.discord_id"
    />

    <div :class="ui.actions({ class: props.ui?.actions })">
      <span v-if="recentlySuccessful" :class="ui.recentlySuccessful({ class: props.ui?.recentlySuccessful })"> Saved. </span>
      <UButton type="submit" label="Save Preferences" :loading="isLoading" />
    </div>
  </UForm>
</template>
