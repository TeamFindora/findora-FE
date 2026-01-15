import { useState } from 'react'
import { MessageThread } from './useMessages'

export const useMessageSidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedThread, setSelectedThread] = useState<MessageThread | null>(null)
  const [view, setView] = useState<'list' | 'thread'>('list')

  const openSidebar = () => {
    setIsOpen(true)
    setView('list')
    setSelectedThread(null)
  }

  const closeSidebar = () => {
    setIsOpen(false)
    setSelectedThread(null)
    setView('list')
  }

  const selectThread = (thread: MessageThread) => {
    setSelectedThread(thread)
    setView('thread')
  }

  const backToList = () => {
    setSelectedThread(null)
    setView('list')
  }

  const toggleSidebar = () => {
    if (isOpen) {
      closeSidebar()
    } else {
      openSidebar()
    }
  }

  return {
    isOpen,
    selectedThread,
    view,
    openSidebar,
    closeSidebar,
    selectThread,
    backToList,
    toggleSidebar
  }
}