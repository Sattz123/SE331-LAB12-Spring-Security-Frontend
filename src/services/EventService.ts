import apiClient from './AxiosClient'
import type { Event } from '@/types'

export default {
  getEventImages(images: string[]) {
    return Promise.all(
      images.map((image) =>
        apiClient
          .get<string>('/presignedUrl', {
            params: { key: image },
            responseType: 'text',
          })
          .then((response) => response.data),
      ),
    )
  },
  getEvents(_perPage: number, _page: number) {
    return apiClient.get('/events?_limit=' + _perPage + '&_page=' + _page)
  },
  getEvent(id: number) {
    return apiClient.get('/events/' + id)
  },
  saveEvent(event: Event) {
    return apiClient.post('/events', event)
  },
  getEventsByKeyword(keyword: string, perPage: number, page: number) {
    return apiClient.get('/events', {
      params: { title: keyword, _limit: perPage, _page: page },
    })
  },
}
