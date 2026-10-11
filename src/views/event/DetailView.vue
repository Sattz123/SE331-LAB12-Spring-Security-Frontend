<script setup lang="ts">
import { ref, toRefs, watch } from 'vue'
import { type Event } from '@/types'
import EventService from '@/services/EventService'

const props = defineProps<{
  event: Event
}>()
const { event } = toRefs(props)
const eventImages = ref<string[]>([])
watch(
  () => event.value.images,
  (images) => {
    EventService.getEventImages(images ?? [])
      .then((urls) => {
        eventImages.value = urls
      })
      .catch((error) => {
        eventImages.value = []
        console.error('Error loading event images:', error)
      })
  },
  { immediate: true },
)
</script>
<template>
  <div>
    <p>{{ event.time }} on {{ event.date }} @ {{ event.location }}</p>
    <p>{{ event.description }}</p>
    <div class="flex flex-row flex-wrap justify-center">
      <img
        v-for="image in eventImages"
        :key="image"
        :src="image"
        alt="events image"
        class="border-solid border-gray-200 border-2 rounded p-1 m-1 w-40 hover:shadow-lg"
      />
    </div>
  </div>
</template>
