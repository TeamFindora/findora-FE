import { useState, useEffect } from 'react'

interface UseApiCallOptions<T> {
  apiFunction: () => Promise<T>
  dependencies?: any[]
  initialData?: T
  onSuccess?: (data: T) => void
  onError?: (error: any) => void
}

export const useApiCall = <T>({
  apiFunction,
  dependencies = [],
  initialData,
  onSuccess,
  onError
}: UseApiCallOptions<T>) => {
  const [data, setData] = useState<T | undefined>(initialData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const executeApiCall = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await apiFunction()
      setData(result)
      
      if (onSuccess) {
        onSuccess(result)
      }
    } catch (err) {
      console.error('API 호출 실패:', err)
      const errorMessage = err instanceof Error ? err.message : '데이터를 불러오는데 실패했습니다.'
      setError(errorMessage)
      
      if (onError) {
        onError(err)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    executeApiCall()
  }, dependencies)

  const refetch = () => {
    executeApiCall()
  }

  const reset = () => {
    setData(initialData)
    setError(null)
    setLoading(false)
  }

  return {
    data,
    loading,
    error,
    refetch,
    reset
  }
}