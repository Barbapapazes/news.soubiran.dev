<script lang="ts">
import type { QuickNews } from '@/app/components/quick-news/QuickNewsCard.vue'
import { useWindowVirtualizer } from '@tanstack/vue-virtual'

const QUICK_NEWS_CARD_HEIGHT = 156
const QUICK_NEWS_CARD_GAP = 24

const quickNewsList = tv({
  slots: {
    base: 'relative w-full',
    card: 'absolute left-0 top-0 w-full',
  },
})

export interface QuickNewsListProps {
  quickNews: QuickNews[]
  class?: any
  ui?: Partial<typeof quickNewsList.slots>
}
export interface QuickNewsListEmits {}
export interface QuickNewsListSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<QuickNewsListProps>()
defineEmits<QuickNewsListEmits>()
defineSlots<QuickNewsListSlots>()

const listRef = ref<HTMLElement | null>(null)
const scrollMargin = ref(0)

function measureElement(el: Element | { $el?: Element } | null) {
  if (!el)
    return

  const element = el instanceof Element ? el : el.$el

  if (element)
    virtualizer.value.measureElement(element)
}

function updateScrollMargin() {
  scrollMargin.value = listRef.value?.offsetTop ?? 0
}

const virtualizer = useWindowVirtualizer(computed(() => ({
  count: props.quickNews.length,
  getItemKey: index => props.quickNews[index]?.id ?? index,
  estimateSize: () => QUICK_NEWS_CARD_HEIGHT,
  overscan: 2,
  gap: QUICK_NEWS_CARD_GAP,
  scrollMargin: scrollMargin.value,
})))

const virtualQuickNews = computed(() => virtualizer.value.getVirtualItems().map(item => ({
  item,
  news: props.quickNews[item.index]!,
})))

onMounted(() => {
  updateScrollMargin()
  window.addEventListener('resize', updateScrollMargin)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateScrollMargin)
})

const ui = computed(() => quickNewsList())
</script>

<template>
  <div
    ref="listRef"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
    :style="{
      height: `${virtualizer.getTotalSize()}px`,
    }"
  >
    <div
      v-for="{ item, news } in virtualQuickNews"
      :key="news.id"
      :ref="measureElement"
      :data-index="item.index"
      :class="ui.card()"
      :style="{
        transform: `translateY(${item.start - scrollMargin}px)`,
      }"
    >
      <QuickNewsCard
        :quick-news="news"
        :class="props.ui?.card"
      />
    </div>
  </div>
</template>
