import { useState, useEffect, useRef, useCallback } from 'react'
import Head from 'next/head'
import { Difficulty, Category, TestResult, PerformancePoint } from '@/types'
import { TEXT_CATEGORIES, DIFFICULTY_LENGTHS } from '@/constants'
import { StatsCard } from '@/components/StatsCard'
import { TextDisplay } from '@/components/TextDisplay'
import { TestCompletionMessage } from '@/components/TestCompletionMessage'
import { AdvancedStats } from '@/components/AdvancedStats'
import { PersonalBestCard } from '@/components/PersonalBestCard'
import { RecentTestsCard } from '@/components/RecentTestsCard'
import { KeyboardHeatmap } from '@/components/KeyboardHeatmap'

export default function Home() {
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
  const [personalBest, setPersonalBest] = useState<TestResult | null>(null)
  const [testHistory, setTestHistory] = useState<TestResult[]>([])
  const [showStats, setShowStats] = useState(false)

  const inputRef = useRef<HTMLTextAreaElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const performanceIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)
  const lastWpmRef = useRef<number[]>([])
  const timeElapsedRef = useRef<number>(0)
  const textRef = useRef<string>('')
  const userInputRef = useRef<string>('')

  // Load personal best and history from localStorage
  useEffect(() => {
    const savedBest = localStorage.getItem('typingTest_personalBest')
    const savedHistory = localStorage.getItem('typingTest_history')
    if (savedBest) setPersonalBest(JSON.parse(savedBest))
    if (savedHistory) setTestHistory(JSON.parse(savedHistory))
  }, [])

  const getTextByDifficulty = useCallback((cat: Category, diff: Difficulty): string => {
    const texts = TEXT_CATEGORIES[cat]
    const baseText = texts[Math.floor(Math.random() * texts.length)]
    const targetLength = DIFFICULTY_LENGTHS[diff]
    
    if (baseText.length >= targetLength) {
      // Find the last space before targetLength to avoid cutting words
      let cutPoint = targetLength
      const lastSpace = baseText.lastIndexOf(' ', targetLength)
      if (lastSpace > targetLength * 0.7) { // Only cut at space if it's not too early
        cutPoint = lastSpace
      }
      return baseText.substring(0, cutPoint).trim()
    }
    
    // Repeat text to reach target length, but always end at a word boundary
    let result = baseText
    while (result.length < targetLength) {
      result += ' ' + baseText
    }
    
    // Find the last space before targetLength to avoid cutting words
    let cutPoint = targetLength
    const lastSpace = result.lastIndexOf(' ', targetLength)
    if (lastSpace > targetLength * 0.7) { // Only cut at space if it's not too early
      cutPoint = lastSpace
    }
    return result.substring(0, cutPoint).trim()
  }, [])

  const generateNewText = useCallback(() => {
    // Randomly select difficulty and category
    const difficulties: Difficulty[] = ['easy', 'medium', 'hard']
    const categories: Category[] = ['quotes', 'programming', 'random', 'literature']
    const randomDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)]
    const randomCategory = categories[Math.floor(Math.random() * categories.length)]
    
    const newText = getTextByDifficulty(randomCategory, randomDifficulty)
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
  }, [getTextByDifficulty])

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

      // Track performance every second
      performanceIntervalRef.current = setInterval(() => {
        const currentInput = userInputRef.current
        const currentTime = timeElapsedRef.current
        
        if (currentInput.length > 0 && currentTime > 0) {
          // Calculate WPM based on characters (5 characters = 1 word)
          const charactersTyped = currentInput.length
          const wordsTyped = Math.max(1, Math.round(charactersTyped / 5))
          const minutes = currentTime / 60
          const currentWpm = minutes > 0 ? Math.round(wordsTyped / minutes) : 0
          
          if (currentWpm > 0) {
            setPerformanceData((prev) => {
              // Avoid duplicates - only add if time is different by at least 0.5 seconds
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
    
    // Raw WPM (total words typed / time)
    const calculatedRawWpm = minutes > 0 ? Math.round(words.length / minutes) : 0
    setRawWpm(calculatedRawWpm)

    // Error calculation
    let errorCount = 0
    for (let i = 0; i < Math.min(input.length, text.length); i++) {
      if (input[i] !== text[i]) {
        errorCount++
      }
    }
    setErrors(errorCount)

    // Accuracy
    const calculatedAccuracy = input.length > 0
      ? Math.max(0, Math.round(((input.length - errorCount) / input.length) * 100))
      : 100
    setAccuracy(calculatedAccuracy)

    // Net WPM (raw WPM adjusted for errors)
    const netWpmValue = Math.max(0, calculatedRawWpm - (errorCount / minutes))
    setNetWpm(Math.round(netWpmValue))
    setWpm(Math.round(netWpmValue))

    // Consistency (based on WPM variance)
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
    // Stop timers first
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
    
    // Use provided time or current timeElapsed from ref
    const testTime = finalTime !== undefined ? finalTime : timeElapsedRef.current
    const currentText = textRef.current || text
    
    // Calculate final stats
    // Count words based on typed characters (5 characters = 1 word)
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
    
    // If input is shorter than text, count remaining characters as errors
    if (finalInput.length < currentText.length) {
      finalErrorCount += (currentText.length - finalInput.length)
    }
    
    const finalAccuracy = finalInput.length > 0
      ? Math.max(0, Math.round(((finalInput.length - finalErrorCount) / finalInput.length) * 100))
      : 100
    
    // Calculate net WPM - apply accuracy as a multiplier
    // This way, if you have 50% accuracy, you get 50% of your raw WPM
    const finalNetWpm = Math.round(finalRawWpm * (finalAccuracy / 100))
    
    // Calculate consistency
    let finalConsistency = 100
    if (lastWpmRef.current.length > 1) {
      const avg = lastWpmRef.current.reduce((a, b) => a + b, 0) / lastWpmRef.current.length
      const variance = lastWpmRef.current.reduce((sum, wpm) => sum + Math.pow(wpm - avg, 2), 0) / lastWpmRef.current.length
      const stdDev = Math.sqrt(variance)
      finalConsistency = Math.max(0, Math.min(100, 100 - (stdDev / avg) * 100))
    }
    
    // Update state immediately
    setWpm(Math.round(finalNetWpm))
    setRawWpm(finalRawWpm)
    setNetWpm(Math.round(finalNetWpm))
    setAccuracy(finalAccuracy)
    setErrors(finalErrorCount)
    setConsistency(Math.round(finalConsistency))
    
    // Save result
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
    
    // Update personal best
    setPersonalBest((prev) => {
      if (!prev || result.wpm > prev.wpm) {
        localStorage.setItem('typingTest_personalBest', JSON.stringify(result))
        return result
      }
      return prev
    })
    
    // Add to history
    setTestHistory((prev) => {
      const newHistory = [result, ...prev].slice(0, 10)
      localStorage.setItem('typingTest_history', JSON.stringify(newHistory))
      return newHistory
    })
  }, [text])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value

    if (!isRunning && value.length > 0) {
      setIsRunning(true)
    }

    // Allow typing even if there are errors - limit to text length
    const limitedValue = value.substring(0, text.length)
    setUserInput(limitedValue)
    userInputRef.current = limitedValue
    setCurrentCharIndex(limitedValue.length)

    // Track key presses for heatmap
    if (limitedValue.length > 0 && value.length <= text.length) {
      const lastChar = value[value.length - 1]
      setKeyPressCount((prev) => ({
        ...prev,
        [lastChar]: (prev[lastChar] || 0) + 1,
      }))
    }

    // Check if finished - when user typed all characters (even with errors)
    if (limitedValue.length >= text.length && text.length > 0 && !isFinished && isRunning) {
      // Small delay to ensure timer has updated
      setTimeout(() => {
        finishTest(limitedValue, timeElapsedRef.current)
      }, 50)
    } else if (isRunning && !isFinished) {
      calculateStats(limitedValue)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Prevent Tab from moving focus
    if (e.key === 'Tab') {
      e.preventDefault()
    }
  }

  const resetTest = () => {
    generateNewText()
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  // Global keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Tab or Esc to start new test
      if (e.key === 'Tab' || e.key === 'Escape') {
        e.preventDefault()
        generateNewText()
        if (inputRef.current) {
          inputRef.current.focus()
        }
      }
      // Ctrl+Enter to finish test
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        if (isRunning && !isFinished) {
          finishTest(userInput, timeElapsedRef.current)
        }
      }
    }

    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown)
    }
  }, [isRunning, isFinished, userInput, generateNewText, finishTest])

  return (
    <>
      <Head>
        <title>Advanced Typing Speed Test</title>
        <meta name="description" content="Professional typing speed test with advanced statistics and analytics" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-6xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-6xl font-bold text-white mb-3 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-pulse-slow">
              Advanced Typing Test
            </h1>
            <p className="text-gray-300 text-lg">Test your typing speed with professional analytics</p>
          </div>

          {/* Toggle Advanced Stats */}
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setShowStats(!showStats)}
              className="px-6 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-lg text-white hover:from-green-500/30 hover:to-emerald-500/30 transition-all duration-200 text-sm font-medium flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {showStats ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                )}
              </svg>
              {showStats ? 'Hide' : 'Show'} Advanced Stats
            </button>
          </div>

          {/* Main Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatsCard
              title="WPM"
              value={wpm}
              subtitle={`Net: ${netWpm} | Raw: ${rawWpm}`}
              gradientFrom="from-purple-500/20"
              gradientTo="to-pink-500/20"
              borderColor="border-purple-400/30"
            />
            <StatsCard
              title="Accuracy"
              value={`${accuracy}%`}
              subtitle={text.length > 0 ? `${text.length - errors} / ${text.length} correct` : '0 / 0 correct'}
              gradientFrom="from-green-500/20"
              gradientTo="to-emerald-500/20"
              borderColor="border-green-400/30"
            />
            <StatsCard
              title="Time"
              value={`${timeElapsed.toFixed(1)}s`}
              subtitle={`${Math.round(timeElapsed / 60)}m ${Math.round(timeElapsed % 60)}s`}
              gradientFrom="from-blue-500/20"
              gradientTo="to-cyan-500/20"
              borderColor="border-blue-400/30"
            />
            <StatsCard
              title="Errors"
              value={errors}
              subtitle={`${consistency}% consistency`}
              gradientFrom="from-red-500/20"
              gradientTo="to-orange-500/20"
              borderColor="border-red-400/30"
            />
          </div>

          {/* Test Completion Message */}
          {isFinished && (
            <TestCompletionMessage
              wpm={wpm}
              accuracy={accuracy}
              timeElapsed={timeElapsed}
            />
          )}

          {/* Advanced Stats */}
          {showStats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="md:col-span-2">
                <AdvancedStats
                  performanceData={performanceData}
                  errors={errors}
                  timeElapsed={timeElapsed}
                />
              </div>
              <div className="space-y-4">
                <PersonalBestCard personalBest={personalBest} />
                <RecentTestsCard testHistory={testHistory} />
              </div>
            </div>
          )}

          {/* Text Display */}
          <TextDisplay
            text={text}
            userInput={userInput}
            currentCharIndex={currentCharIndex}
            isFinished={isFinished}
          />

          {/* Input Area */}
          <div className="mb-6">
            <textarea
              ref={inputRef}
              value={userInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={isFinished}
              placeholder={isFinished ? "Press Tab or Esc to start a new test" : "Start typing here..."}
              className="w-full h-32 p-4 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none font-mono text-lg transition-all duration-200"
            />
          </div>

          {/* Keyboard Heatmap */}
          {showStats && Object.keys(keyPressCount).length > 0 && (
            <KeyboardHeatmap keyPressCount={keyPressCount} />
          )}

          {/* Instructions */}
          <div className="mt-8 text-center text-gray-400 text-sm space-y-1">
            <p>
              Press <kbd className="px-2 py-1 bg-white/10 rounded border border-white/20">Tab</kbd> or{' '}
              <kbd className="px-2 py-1 bg-white/10 rounded border border-white/20">Esc</kbd> to start a new test
              {' • '}
              <kbd className="px-2 py-1 bg-white/10 rounded border border-white/20">Ctrl+Enter</kbd> to finish test
            </p>
            <p className="text-xs text-gray-500">
              The test ends automatically when you type all characters • A new text is generated on each refresh • Professional typing speed test with advanced analytics • Built with Next.js & TypeScript
            </p>
          </div>
        </div>
      </main>
    </>
  )
}
