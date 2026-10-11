import apiClient from './AxiosClient'
import type { Organizer } from '@/types'
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
  saveOrganizer(organizer: Omit<Organizer, 'id' | 'roles'>) {
    return apiClient.post<Organizer>('/organizers', organizer)
  },
}
