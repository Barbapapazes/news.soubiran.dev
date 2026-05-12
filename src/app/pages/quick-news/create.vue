<script lang="ts" setup>
import type { FormSubmitEvent } from '@nuxt/ui'
import { useMutation, useQuery } from '@pinia/colada'
import z from 'zod'
import { postPendingQuickNews } from '@/app/api'
import { isSubscribedQuery, preferencesQuery } from '@/app/queries/push-notifications'
import { userQuery } from '@/app/queries/user'

const { state: userState } = useQuery(userQuery())

const schema = z.object({
  url: z.url(),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  url: undefined,
})

const { mutate, isLoading, recentlySuccessful, error } = useMutation({
  mutation: ({ url }: { url: string }) => postPendingQuickNews(url),
  onSuccess: () => {
    state.url = undefined
  },
})

function onSubmit(event: FormSubmitEvent<Schema>) {
  mutate({
    url: event.data.url,
  })
}

const { data: isSubscribedData } = useQuery(isSubscribedQuery())
const { data: preferencesData } = useQuery(preferencesQuery())

const message = computed(() => {
  // TODO: put it in the html and use v-if to insert link to the direct redirect url, or the login one, or a button to enable the status update
  if (isSubscribedData?.value?.isSubscribed) {
    if (preferencesData.value?.preferences.preferences.includes('statusUpdates')) {
      return ''
    }
    else {
      return ''
    }
  }
  else {
    return ''
  }
})

// TODO: create a constant
// TODO: add a redirect and verify it works
const loginUrl = `${import.meta.env.VITE_BASE_API_URL}/login`
</script>

<template>
  <UContainer class="min-h-[calc(100vh-var(--ui-header-height))] flex items-center justify-center">
    <!-- explain that the news will be reviewed before being published .... -->
    <!-- if the user is subscribe without the statusUpdate, suggest him.. -->
    <!-- if the user is subscribe with the statusUpdate, inform him.. -->
    <!-- if the user is not subscribed, suggest him to subscribe with the statusUpdate enabled -->
    {{ message }}
    <!-- TODO: must be authenticated using discord to submit a news -->
    <UAlert
      v-if="userState.status !== 'success'"
      color="error"
    >
      <template #description>
        You need to be authenticated to propose a news.
      </template>
    </UAlert>

    <UAlert
      v-if="userState.status === 'success' && userState.data.data.discord_id === null"
      color="error"
    >
      <template #description>
        You need to link your Discord account to propose a news. Please go to your <ULink :to="loginUrl" target="_blank" rel="noopener">
          profile settings
        </ULink> to link your Discord account.
      </template>
    </UAlert>

    <UPageCard
      title="Propose a News"
      description="Propose a news by providing its URL. The news will be reviewed before being published. If accepted, it will be automatically analyzed and published on the website and Discord."
      class="max-w-lg mx-auto"
      :ui="{
        container: 'sm:p-4',
      }"
    >
      <UForm :state="state" :schema="schema" class="space-y-4" @submit="onSubmit">
        <UFormField label="News URL" name="url" :error="(error as any)?.data?.errors?.url?.[0]">
          <UInput v-model="state.url" placeholder="https://example.com/news/123" class="w-full" required />
        </UFormField>

        <div class="flex items-center justify-end gap-2">
          <RecentlySuccessful v-if="recentlySuccessful">
            Proposed.
          </RecentlySuccessful>
          <UButton
            label="Propose" type="submit" :loading="isLoading"
            :disabled="userState.status !== 'success' || userState.data.data.discord_id === null"
          />
        </div>
      </UForm>
    </UPageCard>
  </UContainer>
</template>
