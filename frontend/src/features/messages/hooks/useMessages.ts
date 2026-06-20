import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { messagesApi } from '../api/messagesApi'

const QUERY_KEY = ['messages']

export function useMessages() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: messagesApi.list,
  })
}

export function useCreateMessage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (content: string) => messagesApi.create(content),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export function useDeleteMessage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => messagesApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}
