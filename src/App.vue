<script lang="ts" setup>
import type { NavigationMenuItem } from '@nuxt/ui'
import quickNews from 'virtual:quick-news'
import discord from '~icons/simple-icons/discord'
import github from '~icons/simple-icons/github'
import linkedin from '~icons/simple-icons/linkedin'
import twitch from '~icons/simple-icons/twitch'
import x from '~icons/simple-icons/x'
import youtube from '~icons/simple-icons/youtube'

const { trackEvent } = useUmami()

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
