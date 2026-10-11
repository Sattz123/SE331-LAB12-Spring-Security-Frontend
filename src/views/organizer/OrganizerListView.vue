<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { Organizer } from '@/types'
import OrganizerService from '@/services/OrganizerService'
import OrganizerCard from '@/components/OrganizerCard.vue'
import BaseInput from '@/components/BaseInput.vue'

const organizers = ref<Organizer[]>([])
const keyword = ref('')
const loading = ref(true)
const error = ref('')
const filteredOrganizers = computed(() => {
  const search = keyword.value.trim().toLowerCase()
  return organizers.value.filter((organizer) => organizer.name.toLowerCase().includes(search))
})

async function loadOrganizers() {
  loading.value = true
  error.value = ''
  try {
    const response = await OrganizerService.getOrganizers()
    organizers.value = response.data
  } catch {
    error.value = 'Unable to load organizers. Please try again.'
  } finally {
    loading.value = false
  }
}

onMounted(loadOrganizers)
</script>

<template>
  <h1>Organizers</h1>
  <main class="flex flex-col items-center">
    <div class="w-64">
      <BaseInput v-model="keyword" type="text" label="Search organizers..." class="w-full" />
    </div>
    <p v-if="loading">Loading organizers...</p>
    <div v-else-if="error">
      <p role="alert" class="text-red-600">{{ error }}</p>
      <button type="button" class="underline" @click="loadOrganizers">Try again</button>
    </div>
    <template v-else>
      <OrganizerCard
        v-for="organizer in filteredOrganizers"
        :key="organizer.id"
        :organizer="organizer"
      />
      <p v-if="filteredOrganizers.length === 0">No organizers found.</p>
    </template>
  </main>
</template>
