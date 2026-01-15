import { useState, useMemo } from 'react'

interface UseSearchProps<T> {
  data: T[]
  searchFields: (keyof T)[]
  initialSearchTerm?: string
}

export const useSearch = <T>({ 
  data, 
  searchFields, 
  initialSearchTerm = '' 
}: UseSearchProps<T>) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm)

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data

    const lowercaseSearchTerm = searchTerm.toLowerCase()
    
    return data.filter(item => 
      searchFields.some(field => {
        const fieldValue = item[field]
        if (typeof fieldValue === 'string') {
          return fieldValue.toLowerCase().includes(lowercaseSearchTerm)
        }
        return false
      })
    )
  }, [data, searchTerm, searchFields])

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
  }

  const clearSearch = () => {
    setSearchTerm('')
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return {
    searchTerm,
    filteredData,
    handleSearchChange,
    clearSearch,
    handleSearchSubmit,
    hasSearchTerm: searchTerm.trim().length > 0
  }
}