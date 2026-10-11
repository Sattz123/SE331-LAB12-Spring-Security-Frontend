<script setup lang="ts">
import EventService from '@/services/EventService'
import EventCard from '@/components/EventCard.vue'
import BaseInput from '@/components/BaseInput.vue'
import type { Event } from '@/types'
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
const events = ref<Event[] | null>(null)
const keyword = ref('')
const totalEvents = ref<number>(0)
const router = useRouter()
const pageSize = 1
let latestRequest = 0
const hasNextPage = computed(() => {
  const totalPages = Math.ceil(totalEvents.value / pageSize)
  return page.value < totalPages
})
const props = defineProps({
  page: {
    type: Number,
    required: true,
  },
})
const page = computed(() => props.page)
function updateKeyword(inputEvent?: globalThis.Event) {
  const searchText = inputEvent
    ? (inputEvent.target as HTMLInputElement).value
    : keyword.value
  if (inputEvent) keyword.value = searchText

  if (inputEvent && page.value !== 1) {
    router.push({ name: 'event-list-view', query: { page: 1 } })
    return
  }

  const requestId = ++latestRequest
  const queryFunction = searchText === ''
    ? EventService.getEvents(pageSize, page.value)
    : EventService.getEventsByKeyword(searchText, pageSize, page.value)

  queryFunction
    .then((response) => {
      if (requestId !== latestRequest) return
      events.value = response.data
      totalEvents.value = Number(response.headers['x-total-count'] ?? 0)
    })
    .catch(() => {
      if (requestId === latestRequest) router.push({ name: 'network-error-view' })
    })
}

watch(page, () => updateKeyword(), { immediate: true })
</script>

<template>
  <h1>Events For Good</h1>
  <main class="flex flex-col items-center">
    <div class="w-64">
      <BaseInput v-model="keyword" type="text" label="Search..." class="w-full" @input="updateKeyword" />
    </div>
    <EventCard v-for="event in events" :key="event.id" :event="event" />

    <div class="pagination">
      <RouterLink
        id="page-prev"
        :to="{ name: 'event-list-view', query: { page: page - 1 } }"
        rel="prev"
        v-if="page != 1"
        >Prev Page</RouterLink
      >

      <RouterLink
        id="page-next"
        :to="{ name: 'event-list-view', query: { page: page + 1 } }"
        rel="next"
        v-if="hasNextPage"
        >Next Page</RouterLink
      >
    </div>
  </main>
</template>
<style scoped>
.pagination {
  display: flex;
  width: 290px;
}
.pagination a {
  flex: 1;
  text-decoration: none;
  color: #2c3e50;
}

#page-prev {
  text-align: left;
}

#page-next {
  text-align: right;
}
</style>
