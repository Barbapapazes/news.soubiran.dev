<script lang="ts" setup>
import type { FormSubmitEvent } from '@nuxt/ui'
import { useMutation } from '@pinia/colada'
import z from 'zod'
import { postPendingQuickNews } from '@/app/api'

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
</script>

<template>
  <UContainer>
    <UCard
      class="max-w-sm mx-auto"
      :ui="{
        body: 'sm:p-4',
      }"
    >
      <UForm :state="state" :schema="schema" class="space-y-4" @submit="onSubmit">
        <UFormField label="News URL" name="url" :error="(error as any)?.data?.errors.url?.[0]">
          <UInput v-model="state.url" placeholder="https://example.com/news/123" class="w-full" required />
        </UFormField>

        <div class="flex justify-end">
          <span v-if="recentlySuccessful" class="text-muted"> Submitted. </span>
          <UButton label="Submit" type="submit" :loading="isLoading" />
        </div>
      </UForm>
    </UCard>
  </UContainer>
</template>
