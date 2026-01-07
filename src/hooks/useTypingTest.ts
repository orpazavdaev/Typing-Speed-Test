import { useState, useEffect, useRef, useCallback } from 'react'
import { TestResult, PerformancePoint } from '@/types'
import { TEXTS } from '@/constants'

export const useTypingTest = () => {
  const [text, setText] = useState('')
  const [userInput, setUserInput] = useState('')
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [wpm, setWpm] = useState(0)
  const [rawWpm, setRawWpm] = useState(0)
  const [netWpm, setNetWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [errors, setErrors] = useState(0)
  const [consistency, setConsistency] = useState(100)
  const [currentCharIndex, setCurrentCharIndex] = useState(0)
  const [performanceData, setPerformanceData] = useState<PerformancePoint[]>([])
  const [keyPressCount, setKeyPressCount] = useState<Record<string, number>>({})

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const performanceIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)
  const lastWpmRef = useRef<number[]>([])
  const timeElapsedRef = useRef<number>(0)
  const textRef = useRef<string>('')
  const userInputRef = useRef<string>('')

  const generateNewText = useCallback(() => {
    const newText = TEXTS[Math.floor(Math.random() * TEXTS.length)]
    setText(newText)
    textRef.current = newText
    setUserInput('')
    userInputRef.current = ''
    setTimeElapsed(0)
    timeElapsedRef.current = 0
    setIsRunning(false)
    setIsFinished(false)
    setWpm(0)
    setRawWpm(0)
    setNetWpm(0)
    setAccuracy(100)
    setErrors(0)
    setConsistency(100)
    setCurrentCharIndex(0)
    setPerformanceData([])
    setKeyPressCount({})
    lastWpmRef.current = []
    if (timerRef.current) clearInterval(timerRef.current)
    if (performanceIntervalRef.current) clearInterval(performanceIntervalRef.current)
  }, [])

  useEffect(() => {
    generateNewText()
  }, [generateNewText])

  useEffect(() => {
    if (isRunning && !isFinished) {
      startTimeRef.current = Date.now()
      timerRef.current = setInterval(() => {
        setTimeElapsed((prev) => {
          const newTime = prev + 0.1
          timeElapsedRef.current = newTime
          return newTime
        })
      }, 100)

      performanceIntervalRef.current = setInterval(() => {
        const currentInput = userInputRef.current
        const currentTime = timeElapsedRef.current
        
        if (currentInput.length > 0 && currentTime > 0) {
          const charactersTyped = currentInput.length
          const wordsTyped = Math.max(1, Math.round(charactersTyped / 5))
          const minutes = currentTime / 60
          const currentWpm = minutes > 0 ? Math.round(wordsTyped / minutes) : 0
          
          if (currentWpm > 0) {
            setPerformanceData((prev) => {
              const lastPoint = prev[prev.length - 1]
              if (!lastPoint || Math.abs(lastPoint.time - currentTime) > 0.5) {
                return [...prev, { time: currentTime, wpm: currentWpm }]
              }
              return prev
            })
          }
        }
      }, 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
      if (performanceIntervalRef.current) clearInterval(performanceIntervalRef.current)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (performanceIntervalRef.current) clearInterval(performanceIntervalRef.current)
    }
  }, [isRunning, isFinished])

  const calculateStats = useCallback((input: string) => {
    const words = input.trim().split(/\s+/).filter((word) => word.length > 0)
    const minutes = timeElapsed / 60
    
    const calculatedRawWpm = minutes > 0 ? Math.round(words.length / minutes) : 0
    setRawWpm(calculatedRawWpm)

    let errorCount = 0
    for (let i = 0; i < Math.min(input.length, text.length); i++) {
      if (input[i] !== text[i]) {
        errorCount++
      }
    }
    setErrors(errorCount)

    const calculatedAccuracy = input.length > 0
      ? Math.max(0, Math.round(((input.length - errorCount) / input.length) * 100))
      : 100
    setAccuracy(calculatedAccuracy)

    const netWpmValue = Math.max(0, calculatedRawWpm - (errorCount / minutes))
    setNetWpm(Math.round(netWpmValue))
    setWpm(Math.round(netWpmValue))

    if (calculatedRawWpm > 0) {
      lastWpmRef.current.push(calculatedRawWpm)
      if (lastWpmRef.current.length > 10) {
        lastWpmRef.current.shift()
      }
      
      if (lastWpmRef.current.length > 1) {
        const avg = lastWpmRef.current.reduce((a, b) => a + b, 0) / lastWpmRef.current.length
        const variance = lastWpmRef.current.reduce((sum, wpm) => sum + Math.pow(wpm - avg, 2), 0) / lastWpmRef.current.length
        const stdDev = Math.sqrt(variance)
        const consistencyValue = Math.max(0, Math.min(100, 100 - (stdDev / avg) * 100))
        setConsistency(Math.round(consistencyValue))
      }
    }
  }, [text, timeElapsed])

  const finishTest = useCallback((finalInput: string, finalTime?: number) => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    if (performanceIntervalRef.current) {
      clearInterval(performanceIntervalRef.current)
      performanceIntervalRef.current = null
    }
    
    setIsFinished(true)
    setIsRunning(false)
    
    const testTime = finalTime !== undefined ? finalTime : timeElapsedRef.current
    const currentText = textRef.current || text
    
    const charactersTyped = finalInput.length
    const wordsTyped = Math.max(1, Math.round(charactersTyped / 5))
    const minutes = testTime / 60
    const finalRawWpm = minutes > 0 ? Math.round(wordsTyped / minutes) : 0
    
    let finalErrorCount = 0
    for (let i = 0; i < Math.min(finalInput.length, currentText.length); i++) {
      if (finalInput[i] !== currentText[i]) {
        finalErrorCount++
      }
    }
    
    if (finalInput.length < currentText.length) {
      finalErrorCount += (currentText.length - finalInput.length)
    }
    
    const finalAccuracy = finalInput.length > 0
      ? Math.max(0, Math.round(((finalInput.length - finalErrorCount) / finalInput.length) * 100))
      : 100
    
    const finalNetWpm = Math.round(finalRawWpm * (finalAccuracy / 100))
    
    let finalConsistency = 100
    if (lastWpmRef.current.length > 1) {
      const avg = lastWpmRef.current.reduce((a, b) => a + b, 0) / lastWpmRef.current.length
      const variance = lastWpmRef.current.reduce((sum, wpm) => sum + Math.pow(wpm - avg, 2), 0) / lastWpmRef.current.length
      const stdDev = Math.sqrt(variance)
      finalConsistency = Math.max(0, Math.min(100, 100 - (stdDev / avg) * 100))
    }
    
    setWpm(Math.round(finalNetWpm))
    setRawWpm(finalRawWpm)
    setNetWpm(Math.round(finalNetWpm))
    setAccuracy(finalAccuracy)
    setErrors(finalErrorCount)
    setConsistency(Math.round(finalConsistency))
    
    const result: TestResult = {
      wpm: Math.round(finalNetWpm),
      accuracy: finalAccuracy,
      time: testTime,
      errors: finalErrorCount,
      rawWpm: finalRawWpm,
      netWpm: Math.round(finalNetWpm),
      consistency: Math.round(finalConsistency),
      timestamp: Date.now(),
    }
    
    return result
  }, [text])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value

    if (!isRunning && value.length > 0) {
      setIsRunning(true)
    }

    const limitedValue = value.substring(0, text.length)
    setUserInput(limitedValue)
    userInputRef.current = limitedValue
    setCurrentCharIndex(limitedValue.length)

    if (limitedValue.length > 0 && value.length <= text.length) {
      const lastChar = value[value.length - 1]
      setKeyPressCount((prev) => ({
        ...prev,
        [lastChar]: (prev[lastChar] || 0) + 1,
      }))
    }

    if (limitedValue.length >= text.length && text.length > 0 && !isFinished && isRunning) {
      setTimeout(() => {
        finishTest(limitedValue, timeElapsedRef.current)
      }, 50)
    } else if (isRunning && !isFinished) {
      calculateStats(limitedValue)
    }
  }, [text, isRunning, isFinished, finishTest, calculateStats])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
    }
  }, [])

  return {
    text,
    userInput,
    timeElapsed,
    isRunning,
    isFinished,
    wpm,
    rawWpm,
    netWpm,
    accuracy,
    errors,
    consistency,
    currentCharIndex,
    performanceData,
    keyPressCount,
    generateNewText,
    finishTest,
    handleInputChange,
    handleKeyDown,
    timeElapsedRef,
  }
}

