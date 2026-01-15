import { useState, useMemo } from 'react'

export interface SortOption {
  value: string
  label: string
}

interface UseSortProps<T> {
  data: T[]
  sortOptions: SortOption[]
  initialSortBy?: string
  sortFunctions: Record<string, (a: T, b: T) => number>
}

export const useSort = <T>({ 
  data, 
  sortOptions, 
  initialSortBy = 'latest',
  sortFunctions 
}: UseSortProps<T>) => {
  const [sortBy, setSortBy] = useState(initialSortBy)

  const sortedData = useMemo(() => {
    const sortFunction = sortFunctions[sortBy]
    if (!sortFunction) return data

    return [...data].sort(sortFunction)
  }, [data, sortBy, sortFunctions])

  const handleSortChange = (sort: string) => {
    setSortBy(sort)
  }

  const resetSort = () => {
    setSortBy(initialSortBy)
  }

  return {
    sortBy,
    sortedData,
    sortOptions,
    handleSortChange,
    resetSort
  }
}