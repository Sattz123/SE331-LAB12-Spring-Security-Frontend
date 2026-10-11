<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Organizer } from '@/types'
import OrganizerService from '@/services/OrganizerService'
import OrganizerCard from '@/components/OrganizerCard.vue'
import BaseInput from '@/components/BaseInput.vue'

const organizers = ref<Organizer[]>([])
const keyword = ref('')
const loading = ref(true)
const router = useRouter()
const filteredOrganizers = computed(() => {
  const search = keyword.value.trim().toLowerCase()
  return organizers.value.filter((organizer) => organizer.name.toLowerCase().includes(search))
})

async function loadOrganizers() {
  loading.value = true
  try {
    const response = await OrganizerService.getOrganizers()
    organizers.value = response.data
  } catch {
    await router.push({ name: 'network-error-view' })
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
