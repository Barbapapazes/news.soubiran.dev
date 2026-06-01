<script lang="ts" setup>
import type { FormSubmitEvent } from '@nuxt/ui'
import { useMutation, useQuery } from '@pinia/colada'
import z from 'zod'
import bellRinging from '~icons/ph/bell-ringing'
import { postPendingQuickNews } from '@/app/api'
import PushNotificationsModal from '@/app/components/push/PushNotificationsModal.vue'
import { getLoginUrl } from '@/app/constants'
import { isSubscribedQuery, preferencesQuery } from '@/app/queries/push-notifications'
import { userQuery } from '@/app/queries/user'

useHead({
  title: 'Submit News',
})

const { state: userState } = useQuery(userQuery())

const schema = z.object({
  url: z.url({ message: 'Please enter a valid URL' }),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  url: undefined,
})

const successfullySubmitted = ref(false)
const { mutate, isLoading, recentlySuccessful, error } = useMutation({
  mutation: ({ url }: { url: string }) => postPendingQuickNews(url),
  onSuccess: () => {
    state.url = undefined
    successfullySubmitted.value = true
  },
})

function onSubmit(event: FormSubmitEvent<Schema>) {
  mutate({
    url: event.data.url,
  })
}

const loginActions = computed(() => [{
  label: 'Login',
  href: getLoginUrl(),
  target: '_blank',
}])

const { data: isSubscribedData } = useQuery(isSubscribedQuery())
const { data: preferencesData } = useQuery(preferencesQuery())

const notificationsMessage = computed(() => {
  if (isSubscribedData?.value?.isSubscribed) {
    if (preferencesData.value?.preferences.preferences.includes('statusUpdates')) {
      return 'You are subscribed to notifications for news submission status updates.'
    }
    else {
      return 'You are subscribed to notifications, but you have not enabled status updates. Enable them to receive notifications about the status of your news submissions.'
    }
  }
  else {
    return 'You are not subscribed to notifications. Subscribe and enable status updates to receive notifications about the status of your news submissions.'
  }
})

const overlay = useOverlay()
function enableNotifications() {
  overlay
    .create(PushNotificationsModal, {
      destroyOnClose: true,
    })
    .open()
}

// Optimistic login to avoid the flickering of the alert when the user is already logged in but the user query is still in loading state
const isLoggedIn = computed(() => userState.value.status === 'pending' || userState.value.status === 'success')
const canManageNotifications = computed(() => userState.value.status === 'success')
</script>

<template>
  <UContainer class="min-h-[calc(100vh-var(--ui-header-height))] max-w-lg flex flex-col items-center justify-center gap-4">
    <UAlert
      v-if="!isLoggedIn"
      color="primary"
      variant="subtle"
      orientation="horizontal"
      description="You must be signed in to submit a news story."
      :actions="loginActions"
    />

    <UPageCard
      title="Submit a News Story"
      description="Share a link to the story you'd like to suggest."
      class="w-full"
      :ui="{
        container: 'sm:p-4',
      }"
    >
      <UForm :state="state" :schema="schema" class="space-y-4" @submit="onSubmit">
        <UFormField label="News URL" name="url" :error="(error as any)?.data?.errors?.url?.[0] ?? (error as any)?.data?.message">
          <UInput v-model="state.url" placeholder="https://example.com/news/123" class="w-full" required />
        </UFormField>

        <div class="flex items-center justify-end gap-2">
          <RecentlySuccessful v-if="recentlySuccessful">
            Submitted.
          </RecentlySuccessful>
          <UButton
            label="Submit"
            type="submit"
            :loading="isLoading"
            :disabled="!isLoggedIn"
          />
        </div>
      </UForm>
    </UPageCard>

    <UAlert
      v-if="canManageNotifications && successfullySubmitted"
      :icon="bellRinging"
      color="primary"
      variant="subtle"
      :description="notificationsMessage"
      :actions="[
        {
          label: isSubscribedData?.isSubscribed ? 'Manage Notifications' : 'Enable Notifications',
          onClick: enableNotifications,
        },
      ]"
    />

    <div class="text-xs text-dimmed space-y-2">
      <p>
        Each submission is reviewed before publication. I personally curate this feed to keep it high quality.
      </p>
      <ul class="list-disc list-inside space-y-1">
        <li>
          If approved, it will be automatically analyzed and published on the website and in Discord.
        </li>
        <li>
          If rejected, no action will be taken, and you can still submit other stories.
        </li>
      </ul>
      <p v-if="canManageNotifications">
        You can track the status of your submission by enabling <strong class="font-semibold">Status Updates</strong> in your notification preferences.
      </p>
      <p>
        If you have any questions or need help, join our <a href="https://discord.gg/8ZtZsGZ6" target="_blank" class="underline">Discord server</a>.
      </p>
    </div>
  </UContainer>
</template>
