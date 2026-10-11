import axios from 'axios'
import type { Organizer } from '@/types'
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})
export default {
  getOrganizers() {
    return apiClient.get<Organizer[]>('/organizers')
  },
  getOrganizer(id: number) {
    return apiClient.get<Organizer>('/organizers/' + id)
  },
  getOrganizerImage(image: string) {
    return apiClient.get<string>('/presignedUrl', {
      params: { key: image },
      responseType: 'text',
    })
  },
  saveOrganizer(organizer: Omit<Organizer, 'id'>) {
    return apiClient.post<Organizer>('/organizers', organizer)
  },
}
