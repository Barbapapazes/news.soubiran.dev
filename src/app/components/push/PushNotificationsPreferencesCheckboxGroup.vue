<script lang="ts">
const pushNotificationsPreferencesCheckboxGroup = tv({
  slots: {
    base: '',
  },
})

export interface PushNotificationsPreferencesCheckboxGroupProps {
  discordId: string | null
  class?: any
  ui?: Partial<typeof pushNotificationsPreferencesCheckboxGroup.slots>
}
export interface PushNotificationsPreferencesCheckboxGroupEmits {}
export interface PushNotificationsPreferencesCheckboxGroupSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<PushNotificationsPreferencesCheckboxGroupProps>()
defineEmits<PushNotificationsPreferencesCheckboxGroupEmits>()
defineSlots<PushNotificationsPreferencesCheckboxGroupSlots>()

const items = ref([
  {
    label: 'New News',
    description: 'Receive a notification whenever a new news is shared in the community.',
    id: 'newNews' as const,
  },
  {
    label: 'Daily Recap',
    description: 'Receive a daily notification to invite you to check out the news shared in the community during the last 24 hours.',
    id: 'dailyRecap' as const,
  },
  {
    label: 'Weekly Recap',
    description: 'Receive a weekly notification to invite you to check out the news shared in the community during the last 7 days.',
    id: 'weeklyRecap' as const,
  },
  {
    disabled: !props.discordId,
    label: 'Status Updates',
    description: 'Receive a notification a news you shared is accepted or rejected.',
    id: 'statusUpdates' as const,
  },
])

type Item = (typeof items.value)[number]
const value = defineModel<Item['id'][]>({ required: true })

const ui = computed(() => pushNotificationsPreferencesCheckboxGroup())
</script>

<template>
  <UCheckboxGroup
    v-model="value"
    value-key="id"
    :items="items"
    :ui="{
      fieldset: 'gap-y-4',
    }"
    :class="ui.base({ class: props.ui?.base })"
  />
</template>
