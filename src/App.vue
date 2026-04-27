<script lang="ts" setup>
import type { NavigationMenuItem } from '@nuxt/ui'
import { useMutation, useQuery } from '@pinia/colada'
import quickNews from 'virtual:quick-news'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import discord from '~icons/simple-icons/discord'
import github from '~icons/simple-icons/github'
import linkedin from '~icons/simple-icons/linkedin'
import twitch from '~icons/simple-icons/twitch'
import x from '~icons/simple-icons/x'
import youtube from '~icons/simple-icons/youtube'

const { trackEvent } = useUmami()
const QUICK_NEWS_SUGGESTION_PATH = '/suggest-quick-news'
const USER_API_URL = 'https://api.soubiran.dev/api/user'
const QUICK_NEWS_API_URL = 'https://api.soubiran.dev/api/quick-news'
const LOGIN_URL = 'https://api.soubiran.dev/login'
const PROFILE_URL = 'https://api.soubiran.dev/profile'

interface CurrentUser {
  discord?: Record<string, unknown> | string | null
  discord_id?: string | null
  discord_username?: string | null
  discordId?: string | null
  discordUsername?: string | null
  [key: string]: unknown
}

const discordAccountFields = [
  'discord_id',
  'discordId',
  'discord_username',
  'discordUsername',
] as const

const currentPath = ref(getCurrentPath())
const suggestionLink = ref('')
const submissionSuccessMessage = ref('')

const items: NavigationMenuItem[] = [
  {
    label: 'Estéban Soubiran',
    to: 'https://soubiran.dev?utm_source=news.soubiran.dev',
    target: '_blank',
    onSelect() {
      trackEvent('navigation_click', {
        label: 'Estéban Soubiran',
      })
    },
  },
]

const socials = [
  {
    icon: x,
    href: 'https://x.com/soubiran_',
    label: 'X (Twitter)',
  },
  {
    icon: linkedin,
    href: 'https://www.linkedin.com/in/esteban25/',
    label: 'LinkedIn',
  },
  {
    icon: github,
    href: 'https://github.com/barbapapazes',
    label: 'GitHub',
  },
  {
    icon: discord,
    href: 'https://discord.gg/q2ghCGUuFR',
    label: 'Discord',
  },
  {
    icon: youtube,
    href: 'https://www.youtube.com/@barbapapazes',
    label: 'YouTube',
  },
  {
    icon: twitch,
    href: 'https://www.twitch.tv/barbapapazes',
    label: 'Twitch',
  },
]

const isQuickNewsSuggestionPage = computed(() => currentPath.value === QUICK_NEWS_SUGGESTION_PATH)

const { data: currentUser, asyncStatus: currentUserAsyncStatus } = useQuery({
  key: ['current-user'],
  query: async (): Promise<CurrentUser> => {
    const response = await fetch(USER_API_URL, {
      credentials: 'include',
      headers: {
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch current user (status ${response.status}).`)
    }

    return await response.json()
  },
})

const currentUserHasDiscordAccount = computed(() => hasDiscordAccount(currentUser.value))
const accountRequirement = computed(() => {
  if (currentUserAsyncStatus.value === 'loading') {
    return null
  }

  if (!currentUser.value) {
    return {
      actionLabel: 'Authenticate',
      actionUrl: LOGIN_URL,
      description: 'Sign in before suggesting a quick-news.',
      title: 'Authentication required',
    }
  }

  if (!currentUserHasDiscordAccount.value) {
    return {
      actionLabel: 'Associate Discord account',
      actionUrl: PROFILE_URL,
      description: 'Associate your Discord account before suggesting a quick-news.',
      title: 'Discord account required',
    }
  }

  return null
})

const { mutateAsync: submitQuickNewsSuggestion, asyncStatus: submissionAsyncStatus, error: submissionError } = useMutation({
  mutation: async (link: string) => {
    const response = await fetch(QUICK_NEWS_API_URL, {
      body: JSON.stringify({ link }),
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })

    if (!response.ok) {
      throw new Error(`Failed to submit quick-news suggestion (status ${response.status}).`)
    }
  },
})

const submissionErrorMessage = computed(() => {
  if (!submissionError.value) {
    return ''
  }

  return submissionError.value instanceof Error
    ? submissionError.value.message
    : 'Could not submit your quick-news suggestion.'
})

const isSubmitDisabled = computed(() => {
  return currentUserAsyncStatus.value === 'loading'
    || submissionAsyncStatus.value === 'loading'
    || !suggestionLink.value.trim()
    || !currentUser.value
    || !currentUserHasDiscordAccount.value
})

function trackSocialClick(label: string) {
  trackEvent('social_click', {
    label,
  })
}
function trackQuickNewsClick(id: string) {
  trackEvent('quick_news_click', {
    id,
  })
}

function getCurrentPath(): string {
  if (typeof window === 'undefined') {
    return '/'
  }

  const hashPath = window.location.hash.slice(1)

  if (hashPath) {
    return normalizePath(hashPath)
  }

  return '/'
}

function normalizePath(path: string): string {
  if (path !== '/' && path.endsWith('/')) {
    return path.slice(0, -1)
  }

  return path || '/'
}

function updateCurrentPath() {
  currentPath.value = getCurrentPath()
}

function navigateTo(path: string) {
  if (typeof window === 'undefined') {
    return
  }

  const normalizedPath = normalizePath(path)

  if (normalizedPath === currentPath.value) {
    return
  }

  window.location.hash = normalizedPath === '/' ? '' : normalizedPath
  updateCurrentPath()
}

function hasDiscordAccount(user: CurrentUser | undefined) {
  if (!user) {
    return false
  }

  if (discordAccountFields.some(field => isNonEmptyString(user[field]))) {
    return true
  }

  if (isNonEmptyString(user.discord)) {
    return true
  }

  if (user.discord && typeof user.discord === 'object') {
    return Object.keys(user.discord).length > 0
  }

  return false
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0
}

async function submitSuggestion() {
  const link = suggestionLink.value.trim()

  if (!link) {
    return
  }

  submissionSuccessMessage.value = ''

  try {
    await submitQuickNewsSuggestion(link)

    suggestionLink.value = ''
    submissionSuccessMessage.value = 'Your quick-news suggestion has been sent.'
  }
  catch {
    submissionSuccessMessage.value = ''
  }
}

onMounted(() => {
  updateCurrentPath()
  window.addEventListener('hashchange', updateCurrentPath)
})

onBeforeUnmount(() => {
  window.removeEventListener('hashchange', updateCurrentPath)
})
</script>

<template>
  <UApp>
    <UHeader title="News" :toggle="false">
      <template #right>
        <UButton
          v-for="social in socials"
          :key="social.label"
          :to="social.href"
          target="_blank"
          :icon="social.icon"
          variant="ghost"
          color="neutral"
          :aria-label="social.label"
          @click="trackSocialClick(social.label)"
        />
      </template>
    </UHeader>

    <UMain class="mt-8">
      <UContainer>
        <div
          v-if="isQuickNewsSuggestionPage"
          class="space-y-6"
        >
          <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div class="space-y-1">
              <h1 class="text-2xl font-semibold">
                Suggest a quick-news
              </h1>
              <p class="text-sm text-muted">
                Share a link to suggest an article for the quick-news feed.
              </p>
            </div>

            <UButton
              label="Back to the news"
              color="neutral"
              variant="ghost"
              @click="navigateTo('/')"
            />
          </div>

          <UCard>
            <form class="space-y-4" @submit.prevent="submitSuggestion">
              <div class="space-y-2">
                <label class="text-sm font-medium" for="quick-news-link">Article link</label>
                <UInput
                  id="quick-news-link"
                  v-model="suggestionLink"
                  type="url"
                  placeholder="https://example.com/article"
                  aria-describedby="quick-news-link-help"
                  required
                />
                <p id="quick-news-link-help" class="text-sm text-muted">
                  Only the link is sent to the API.
                </p>
              </div>

              <p
                v-if="currentUserAsyncStatus === 'loading'"
                class="text-sm text-muted"
              >
                Checking your account…
              </p>

              <template v-else-if="accountRequirement">
                <UAlert
                  color="warning"
                  variant="subtle"
                  :title="accountRequirement.title"
                  :description="accountRequirement.description"
                />

                <UButton :label="accountRequirement.actionLabel" :to="accountRequirement.actionUrl" />
              </template>

              <UAlert
                v-if="submissionSuccessMessage"
                color="success"
                variant="subtle"
                title="Suggestion sent"
                :description="submissionSuccessMessage"
              />

              <UAlert
                v-if="submissionErrorMessage"
                color="error"
                variant="subtle"
                title="Could not submit the suggestion"
                :description="submissionErrorMessage"
              />

              <div class="flex justify-end">
                <UButton
                  type="submit"
                  label="Submit link"
                  :loading="submissionAsyncStatus === 'loading'"
                  :disabled="isSubmitDisabled"
                />
              </div>
            </form>
          </UCard>
        </div>

        <div v-else class="space-y-6">
          <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div class="space-y-1">
              <h1 class="text-2xl font-semibold">
                Latest quick news
              </h1>
              <p class="text-sm text-muted">
                Keep up with the latest curated articles and suggest the next one.
              </p>
            </div>

            <UButton
              label="Suggest a quick-news"
              @click="navigateTo(QUICK_NEWS_SUGGESTION_PATH)"
            />
          </div>

          <div class="space-y-6">
            <UCard
              v-for="news in quickNews"
              :key="news.id"
              class="relative"
              :ui="{
                body: 'flex flex-col md:flex-row md:items-center md:justify-between gap-4',
              }"
            >
              <h2 class="font-semibold">
                {{ news.title }}
              </h2>

              <div class="flex flex-row items-center justify-end gap-2">
                <UButton
                  label="Read the article"
                  :to="`${news.url}?utm_source=news.soubiran.dev&utm_medium=referral&utm_campaign=news` "
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="link"
                  @click="trackQuickNewsClick(news.id)"
                />
                <UButton
                  label="Discuss on Discord"
                  :to="news.discord_message_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  @click="trackQuickNewsClick(news.id)"
                />
              </div>
            </UCard>
          </div>
        </div>
      </UContainer>
    </UMain>

    <UFooter>
      <template #left>
        <UNavigationMenu :items="items" variant="link" :external-icon="false" />
      </template>

      <template #right>
        <UButton
          v-for="social in socials"
          :key="social.label"
          :to="social.href"
          target="_blank"
          :icon="social.icon"
          variant="ghost"
          color="neutral"
          :aria-label="social.label"
          @click="trackSocialClick(social.label)"
        />
      </template>
    </UFooter>
  </UApp>
</template>
