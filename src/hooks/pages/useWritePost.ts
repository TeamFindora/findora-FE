import { usePostForm } from '../posts/usePostForm'

export const useWritePost = () => {
  return usePostForm({
    mode: 'create'
  })
}