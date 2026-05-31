<script lang="ts" setup>
import { PiniaColadaDevtools } from '@pinia/colada-devtools'
import heart from '~icons/ph/heart-duotone'
import home from '~icons/ph/house-duotone'
import json from '~icons/ph/plugs-connected-duotone'
import rss from '~icons/ph/rss-duotone'

const links = [
  {
    label: 'Home',
    to: '/',
    icon: home,
  },
  {
    label: 'Support',
    href: 'https://soubiran.dev/sponsorship?utm_source=news.soubiran.dev&utm_medium=referral&utm_campaign=sponsorship',
    target: '_blank',
    icon: heart,
  },
  {
    label: 'RSS',
    target: '_blank',
    href: `${window.location.origin}/feed.rss`,
    icon: rss,
  },
  {
    label: 'JSON',
    target: '_blank',
    href: `${window.location.origin}/quick-news.json`,
    icon: json,
  },
]

useHead({
  titleTemplate: '%s · Estéban Soubiran',
})
</script>

<template>
  <UApp>
    <Header :links="links" />

    <UMain>
      <RouterView />
    </UMain>
  </UApp>

  <PiniaColadaDevtools />
</template>
