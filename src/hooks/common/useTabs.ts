import { useState } from 'react'

export type TabType = 'free' | 'best' | 'bookmark'

export const useTabs = (initialTab: TabType = 'free') => {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab)

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
  }

  const isActiveTab = (tab: TabType) => activeTab === tab

  return {
    activeTab,
    handleTabChange,
    isActiveTab
  }
}