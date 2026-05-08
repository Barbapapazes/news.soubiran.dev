<script lang="ts">
import article from '~icons/ph/article-ny-times-duotone'
import discord from '~icons/simple-icons/discord'

const quickNewsCard = tv({
  slots: {
    base: '',
    header: 'flex flex-col gap-2 md:flex-row md:items-center justify-between',
    headerActions: 'flex flex-row items-center gap-2',
    headerActionsButton: 'p-0 text-dimmed',
    title: 'font-semibold text-highlighted',
    description: 'mt-2 text-sm text-muted',
    authors: 'mt-4 flex flex-wrap gap-2',
    author: 'rounded-full bg-elevated text-highlighted',
  },
})

export interface QuickNews {
  id: string
  title: string
  summary: string
  authors: string[]
  url: string
  discord_message_url: string
}

export interface QuickNewsCardProps {
  quickNews: QuickNews
  class?: any
  ui?: Partial<typeof quickNewsCard.slots>
}
export interface QuickNewsCardEmits {}
export interface QuickNewsCardSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<QuickNewsCardProps>()
defineEmits<QuickNewsCardEmits>()
defineSlots<QuickNewsCardSlots>()

const { track } = useUmami()

function trackQuickNewsUrl(id: string) {
  track('quick_news_url', {
    id,
  })
}

function trackQuickNewsDiscord(id: string) {
  track('quick_news_discord', {
    id,
  })
}

const ui = computed(() => quickNewsCard())
</script>

<template>
  <UCard
    :class="ui.base({ class: [props.ui?.base, props.class] })"
    :ui="{
      body: 'sm:p-4',
    }"
  >
    <div :class="ui.header({ class: props.ui?.header })">
      <h2 :class="ui.title({ class: props.ui?.title })">
        {{ props.quickNews.title }}
      </h2>

      <div :class="ui.headerActions({ class: props.ui?.headerActions })">
        <UTooltip text="Read the article">
          <UButton
            aria-label="Read the article"
            :to="`${props.quickNews.url}?utm_source=news.soubiran.dev&utm_medium=referral&utm_campaign=news`"
            size="sm"
            variant="link"
            target="_blank"
            rel="noopener noreferrer"
            :icon="article"
            :class="ui.headerActionsButton({ class: props.ui?.headerActionsButton })"
            @click="trackQuickNewsUrl(props.quickNews.id)"
          />
        </UTooltip>
        <UTooltip text="Discuss on Discord">
          <UButton
            aria-label="Discuss on Discord"
            :to="props.quickNews.discord_message_url"
            size="sm"
            variant="link"
            target="_blank"
            rel="noopener noreferrer"
            :icon="discord"
            :class="ui.headerActionsButton({ class: props.ui?.headerActionsButton })"
            @click="trackQuickNewsDiscord(props.quickNews.id)"
          />
        </UTooltip>
      </div>
    </div>
    <p :class="ui.description({ class: props.ui?.description })">
      {{ props.quickNews.summary }}
    </p>

    <div
      v-if="props.quickNews.authors.length"
      :class="ui.authors({ class: props.ui?.authors })"
    >
      <UBadge
        v-for="author in props.quickNews.authors"
        :key="author"
        :class="ui.author({ class: props.ui?.author })"
      >
        {{ author }}
      </UBadge>
    </div>
  </UCard>
</template>
