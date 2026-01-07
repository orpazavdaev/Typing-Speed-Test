import { useState, useEffect, useRef, useCallback } from 'react'
import Head from 'next/head'
import { Difficulty, Category, TestResult, PerformancePoint } from '@/types'
import { TEXT_CATEGORIES, DIFFICULTY_LENGTHS } from '@/constants'
import { StatsCard } from '@/components/StatsCard'
import { TextDisplay } from '@/components/TextDisplay'
import { SettingsPanel } from '@/components/SettingsPanel'
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
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [category, setCategory] = useState<Category>('quotes')
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
      return baseText.substring(0, targetLength)
    }
    
    // Repeat text to reach target length
    let result = baseText
    while (result.length < targetLength) {
      result += ' ' + baseText
    }
    return result.substring(0, targetLength)
  }, [])

  const generateNewText = useCallback(() => {
    const newText = getTextByDifficulty(category, difficulty)
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
  }, [category, difficulty, getTextByDifficulty])

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
    if (e.key === 'Tab') {
      e.preventDefault()
      generateNewText()
    }
    if (e.key === 'Escape') {
      e.preventDefault()
      generateNewText()
    }
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      if (isRunning && !isFinished) {
        finishTest(userInput, timeElapsedRef.current)
      }
    }
  }

  const resetTest = () => {
    generateNewText()
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

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

          {/* Settings Panel */}
          <SettingsPanel
            difficulty={difficulty}
            category={category}
            isRunning={isRunning}
            showStats={showStats}
            onDifficultyChange={setDifficulty}
            onCategoryChange={setCategory}
            onToggleStats={() => setShowStats(!showStats)}
            onGenerateNewText={generateNewText}
          />

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
          <div className="mb-4">
            <textarea
              ref={inputRef}
              value={userInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={isFinished}
              placeholder={isFinished ? "Press Tab or click Reset to try again" : "Start typing here..."}
              className="w-full h-32 p-4 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none font-mono text-lg transition-all duration-200"
            />
          </div>

          {/* Controls */}
          <div className="flex gap-4 justify-center mb-6 flex-wrap">
            <button
              onClick={resetTest}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              Reset Test
            </button>
            {isRunning && !isFinished && (
              <button
                onClick={() => finishTest(userInput, timeElapsedRef.current)}
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Finish Test
              </button>
            )}
            {isFinished && (
              <div className="px-6 py-3 bg-green-500/20 border border-green-400/50 text-green-300 font-semibold rounded-xl flex items-center gap-2 animate-pulse">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Test Completed!
              </div>
            )}
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
              The test ends automatically when you type all characters, or click "Finish Test" • Professional typing speed test with advanced analytics • Built with Next.js & TypeScript
            </p>
          </div>
        </div>
      </main>
    </>
  )
}
