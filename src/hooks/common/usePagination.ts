import { useState, useMemo } from 'react'

interface UsePaginationProps {
  totalItems: number
  itemsPerPage?: number
  initialPage?: number
}

export const usePagination = ({ 
  totalItems, 
  itemsPerPage = 10, 
  initialPage = 1 
}: UsePaginationProps) => {
  const [currentPage, setCurrentPage] = useState(initialPage)

  const paginationInfo = useMemo(() => {
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage

    return {
      totalPages,
      startIndex,
      endIndex,
      hasPrevious: currentPage > 1,
      hasNext: currentPage < totalPages
    }
  }, [totalItems, itemsPerPage, currentPage])

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= paginationInfo.totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const resetToFirstPage = () => {
    setCurrentPage(1)
  }

  const goToNextPage = () => {
    if (paginationInfo.hasNext) {
      handlePageChange(currentPage + 1)
    }
  }

  const goToPreviousPage = () => {
    if (paginationInfo.hasPrevious) {
      handlePageChange(currentPage - 1)
    }
  }

  return {
    currentPage,
    ...paginationInfo,
    handlePageChange,
    resetToFirstPage,
    goToNextPage,
    goToPreviousPage
  }
}