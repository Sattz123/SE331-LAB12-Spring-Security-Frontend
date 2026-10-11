<script setup lang="ts">
import { ref, watch } from 'vue'
import { isAxiosError } from 'axios'
import { useRouter } from 'vue-router'
import type { Organizer } from '@/types'
import OrganizerService from '@/services/OrganizerService'

const props = defineProps<{ id: string }>()
const router = useRouter()
const organizer = ref<Organizer | null>(null)
const imageUrl = ref('')
const loading = ref(false)
const error = ref('')
const imageError = ref('')

watch(
  () => props.id,
  async (id, _previousId, onCleanup) => {
    let cancelled = false
    onCleanup(() => { cancelled = true })
    organizer.value = null
    imageUrl.value = ''
    error.value = ''
    imageError.value = ''
    loading.value = true

    try {
      const response = await OrganizerService.getOrganizer(Number(id))
      if (cancelled) return
      organizer.value = response.data
      loading.value = false

      if (response.data.image) {
        try {
          const imageResponse = await OrganizerService.getOrganizerImage(response.data.image)
          if (!cancelled) imageUrl.value = imageResponse.data
        } catch {
          if (!cancelled) imageError.value = 'Unable to load the organizer image.'
        }
      }
    } catch (requestError) {
      if (cancelled) return
      if (isAxiosError(requestError) && requestError.response?.status === 404) {
        router.replace({ name: '404-resource-view', params: { resource: 'organizer' } })
      } else {
        error.value = 'Unable to load the organizer. Please try again.'
      }
    } finally {
      if (!cancelled) loading.value = false
    }
  },
  { immediate: true },
)
</script>

<template>
  <div>
    <RouterLink :to="{ name: 'organizer-list-view' }">Back to Organizers</RouterLink>
    <p v-if="loading">Loading organizer...</p>
    <p v-else-if="error" role="alert" class="text-red-600">{{ error }}</p>
    <div v-else-if="organizer">
      <h1>{{ organizer.name }}</h1>
      <img
        v-if="imageUrl"
        :src="imageUrl"
        :alt="organizer.name + ' image'"
        class="mx-auto my-4 max-w-xs rounded border-2 border-gray-200 p-1"
        @error="imageUrl = ''; imageError = 'Unable to load the organizer image.'"
      />
      <p v-else-if="imageError" role="alert" class="text-red-600">{{ imageError }}</p>
      <p v-else-if="organizer.image">Loading image...</p>
      <p v-else>No image uploaded.</p>
      <p>Address: {{ organizer.address || 'No address provided.' }}</p>
    </div>
  </div>
</template>
