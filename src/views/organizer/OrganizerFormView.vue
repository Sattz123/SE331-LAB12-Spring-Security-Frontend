<script setup lang="ts">
import type { Organizer } from '@/types'
import { computed, ref } from 'vue'
import OrganizerService from '@/services/OrganizerService'
import ImageUpload from '@/components/ImageUpload.vue'
import { useRouter } from 'vue-router'
import { useMessageStore } from '@/stores/message'

const organizer = ref<Omit<Organizer, 'id'>>({
  name: '',
  address: '',
  image: '',
})
const uploadReset = ref(0)
const isSaving = ref(false)
const imageError = ref('')
const images = computed<string[]>({
  get: () => organizer.value.image ? [organizer.value.image] : [],
  set: (images) => {
    organizer.value.image = images[0] ?? ''
    imageError.value = ''
  },
})

const router = useRouter()
const store = useMessageStore()

function saveOrganizer() {
  if (isSaving.value) return
  isSaving.value = true
  OrganizerService.saveOrganizer(organizer.value)
    .then((response) => {
      store.updateMessage('You have successfully added a new organizer: ' + response.data.name)
      setTimeout(() => {
        store.resetMessage()
      }, 3000)
      organizer.value = {
        name: '',
        address: '',
        image: '',
      }
      uploadReset.value += 1
      imageError.value = ''
      router.push({ name: 'organizer-detail-view', params: { id: response.data.id } })
    })
    .catch(() => {
      router.push({ name: 'network-error-view' })
    })
    .finally(() => {
      isSaving.value = false
    })
}
</script>

<template>
  <div>
    <h1>Create an Organizer</h1>
    <form @submit.prevent="saveOrganizer">
      <label class="block text-gray-500 font-bold">Organization Name</label>
      <input
        v-model="organizer.name"
        type="text"
        placeholder="Organization Name"
        class="h-13 w-1/4 px-2.5 text-xl border border-gray-400 focus:border-emerald-500 focus:outline-none mb-6"
        required
      />

      <label class="block text-gray-500 font-bold">Address</label>
      <input
        v-model="organizer.address"
        type="text"
        placeholder="Address"
        class="h-13 w-1/4 px-2.5 text-xl border border-gray-400 focus:border-emerald-500 focus:outline-none mb-6"
        required
      />

      <h3>Organizer image (maximum 1)</h3>
      <ImageUpload
        :key="uploadReset"
        v-model="images"
        :max="1"
        @max="imageError = 'Only one image is allowed. Remove the current image to replace it.'"
      />
      <p v-if="imageError" role="alert" class="text-red-600">{{ imageError }}</p>

      <div>
        <button
          class="flex w-fit mx-auto items-center justify-center h-13 px-10 rounded-md font-semibold whitespace-nowrap border border-gray-400 focus:border-emerald-500 transition-all duration-200 ease-linear hover:scale-105 hover:border-emerald-500 hover:shadow-lg active:scale-100 focus:outline-none"
          type="submit"
          :disabled="isSaving"
        >
          {{ isSaving ? 'Saving...' : 'Submit' }}
        </button>
      </div>
    </form>

    <pre class="mt-6">{{ organizer }}</pre>
  </div>
</template>
