import api from '../../../lib/api'

export interface Message {
  id: string
  content: string
  created_at: string
}

export const messagesApi = {
  list: () =>
    api.get<{ success: boolean; data: Message[] }>('/api/v1/messages').then(r => r.data.data),

  create: (content: string) =>
    api.post<{ success: boolean; data: Message }>('/api/v1/messages', { content }).then(r => r.data.data),

  delete: (id: string) =>
    api.delete(`/api/v1/messages/${id}`),
}
