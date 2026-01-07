import { useState, useEffect } from 'react'
import { TestResult } from '@/types'

export const useLocalStorage = () => {
  const [personalBest, setPersonalBest] = useState<TestResult | null>(null)
  const [testHistory, setTestHistory] = useState<TestResult[]>([])

  useEffect(() => {
    const savedBest = localStorage.getItem('typingTest_personalBest')
    const savedHistory = localStorage.getItem('typingTest_history')
    if (savedBest) setPersonalBest(JSON.parse(savedBest))
    if (savedHistory) setTestHistory(JSON.parse(savedHistory))
  }, [])

  const updatePersonalBest = (result: TestResult) => {
    setPersonalBest((prev) => {
      if (!prev || result.wpm > prev.wpm) {
        localStorage.setItem('typingTest_personalBest', JSON.stringify(result))
        return result
      }
      return prev
    })
  }

  const addToHistory = (result: TestResult) => {
    setTestHistory((prev) => {
      const newHistory = [result, ...prev].slice(0, 10)
      localStorage.setItem('typingTest_history', JSON.stringify(newHistory))
      return newHistory
    })
  }

  return {
    personalBest,
    testHistory,
    updatePersonalBest,
    addToHistory,
  }
}

