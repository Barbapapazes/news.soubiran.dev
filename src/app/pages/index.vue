<script lang="ts" setup>
import prose from '@soubiran/ui/wrapper-classes'
import quickNews from 'virtual:quick-news'
import bell from '~icons/ph/bell'
import newspaper from '~icons/ph/newspaper'
import discord from '~icons/simple-icons/discord'
import PushNotificationsModal from '@/app/components/push/PushNotificationsModal.vue'

const title = 'News'
useHead({
  title,
})

const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY
const isPushNotificationsSupported = computed(() => {
  return typeof window !== 'undefined'
    && window.isSecureContext
    && 'serviceWorker' in navigator
    && 'PushManager' in window
    && 'Notification' in window
    && vapidPublicKey.length > 0
})

const overlay = useOverlay()
function enableNotifications() {
  overlay
    .create(PushNotificationsModal, {
      destroyOnClose: true,
    })
    .open()
}
</script>

<template>
  <UContainer>
    <UPage
      :ui="{
        root: 'max-w-3xl mx-auto',
      }"
    >
      <UPageHeader
        :title="title"
      />

      <UPageBody>
        <div :class="prose.join(' ')">
          <p>
            News is my <strong>personal technology monitoring feed</strong>, a way to keep up with the accelerating pace of the tech world. Everything I find interesting and want to track ends up here and on <a href="https://discord.gg/q2ghCGUuFR" target="_blank" rel="noopener">Discord</a>, with a summary, key bullet points, and a critical analysis.
          </p>
          <p>
            You can join us and <strong>share your own</strong> as well. The more news we share, the more we can learn from one another and stay up to date with the latest developments in tech.
          </p>
          <div class="flex flex-col gap-4 md:flex-row">
            <UButton label="Share News" to="/quick-news/create" :icon="newspaper" block />
            <UButton label="Join the Discord" href="https://discord.gg/q2ghCGUuFR" target="_blank" rel="noopener" :icon="discord" block />
            <UButton :label="isPushNotificationsSupported ? 'Enable Notifications' : 'Notifications Not Supported'" :icon="bell" block :disabled="!isPushNotificationsSupported" @click="enableNotifications" />
          </div>
          <p>
            <!-- TODO: links -->
            To learn more about News, read the announcement on <a href="https://soubiran.dev/posts/?utm_source=news.soubiran.dev&utm_medium=referral&utm_campaign=announcement" target="_blank" rel="noopener">soubiran.dev</a>. You can also support the project by becoming a sponsor at <a href="https://soubiran.dev/sponsorship?utm_source=news.soubiran.dev&utm_medium=referral&utm_campaign=sponsorship" target="_blank" rel="noopener">soubiran.dev/sponsorship</a>.
          </p>
        </div>

        <QuickNewsList
          :quick-news="quickNews"
        />
      </UPageBody>
    </UPage>
  </UContainer>
</template>
