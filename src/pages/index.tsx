import { useState, useEffect, useRef, useCallback } from 'react'
import Head from 'next/head'

type Difficulty = 'easy' | 'medium' | 'hard'
type Category = 'quotes' | 'programming' | 'random' | 'literature'

interface TestResult {
  wpm: number
  accuracy: number
  time: number
  errors: number
  rawWpm: number
  netWpm: number
  consistency: number
  timestamp: number
}

interface PerformancePoint {
  time: number
  wpm: number
}

const TEXT_CATEGORIES: Record<Category, string[]> = {
  quotes: [
    "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet.",
    "Programming is the art of telling another human being what one wants the computer to do.",
    "The best way to predict the future is to invent it. Computer science is no more about computers than astronomy is about telescopes.",
    "Code is like humor. When you have to explain it, it's bad. Clean code always looks like it was written by someone who cares.",
    "First, solve the problem. Then, write the code. Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
  ],
  programming: [
    "const fetchData = async () => { const response = await fetch('/api/data'); return response.json(); }",
    "function binarySearch(arr, target) { let left = 0, right = arr.length - 1; while (left <= right) { const mid = Math.floor((left + right) / 2); if (arr[mid] === target) return mid; arr[mid] < target ? left = mid + 1 : right = mid - 1; } return -1; }",
    "class Component extends React.Component { constructor(props) { super(props); this.state = { count: 0 }; } render() { return <div>{this.state.count}</div>; } }",
    "const debounce = (func, wait) => { let timeout; return function executedFunction(...args) { const later = () => { clearTimeout(timeout); func(...args); }; clearTimeout(timeout); timeout = setTimeout(later, wait); }; };",
    "interface User { id: number; name: string; email: string; } const users: User[] = [{ id: 1, name: 'John', email: 'john@example.com' }];",
  ],
  random: [
    "The mysterious package arrived on a Tuesday morning, wrapped in brown paper and tied with string. Inside, there was nothing but a single key and a note that read: 'The adventure begins now.'",
    "She walked through the ancient forest, where sunlight filtered through the canopy in golden streams. Every step crunched on fallen leaves, and the air smelled of damp earth and pine.",
    "The old lighthouse stood tall against the stormy sky, its beam cutting through the darkness like a sword. Waves crashed against the rocky shore, sending spray high into the air.",
    "In the heart of the city, neon signs flickered to life as dusk settled. Crowds of people moved like rivers through the streets, each person lost in their own world of thoughts and destinations.",
    "The recipe called for three cups of flour, two eggs, and a pinch of magic. As she mixed the ingredients, the batter began to glow with an otherworldly light, promising something extraordinary.",
  ],
  literature: [
    "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity.",
    "In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends of worms and an oozy smell, nor yet a dry, bare, sandy hole with nothing in it to sit down on or to eat: it was a hobbit-hole, and that means comfort.",
    "Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world.",
    "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife. However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families.",
    "The sun was shining on the sea, shining with all his might: He did his very best to make the billows smooth and bright—And this was odd, because it was the middle of the night.",
  ],
}

const DIFFICULTY_LENGTHS: Record<Difficulty, number> = {
  easy: 50,
  medium: 100,
  hard: 200,
}

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
        if (userInput.length > 0 && timeElapsed > 0) {
          const words = userInput.trim().split(/\s+/).filter((w) => w.length > 0)
          const minutes = timeElapsed / 60
          const currentWpm = minutes > 0 ? words.length / minutes : 0
          setPerformanceData((prev) => [...prev, { time: timeElapsed, wpm: Math.round(currentWpm) }])
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
  }, [isRunning, isFinished, userInput, timeElapsed])

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
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value

    if (!isRunning && value.length > 0) {
      setIsRunning(true)
    }

    // Allow typing even if there are errors - limit to text length
    const limitedValue = value.substring(0, text.length)
    setUserInput(limitedValue)
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

  const getCharClass = (index: number) => {
    if (index >= userInput.length) {
      return 'text-gray-400'
    }
    if (userInput[index] === text[index]) {
      return 'text-green-400 bg-green-400/20'
    }
    return 'text-red-400 bg-red-400/20 underline'
  }

  const resetTest = () => {
    generateNewText()
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const maxKeyPresses = Math.max(...Object.values(keyPressCount), 1)
  const maxPerformanceWpm = Math.max(...performanceData.map(p => p.wpm), 1)

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

          {/* Settings */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-5 mb-6 border border-white/20 shadow-lg">
            <div className="flex flex-wrap gap-6 items-center justify-center">
              <div className="flex flex-col gap-2">
                <label className="text-gray-300 text-sm font-medium flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Difficulty
                </label>
                <div className="relative">
                  <select
                    value={difficulty}
                    onChange={(e) => {
                      setDifficulty(e.target.value as Difficulty)
                      generateNewText()
                    }}
                    disabled={isRunning}
                    className="appearance-none px-4 py-2.5 pr-10 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-lg text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-500/30 hover:to-pink-500/30 min-w-[140px] shadow-md"
                    style={{ color: 'white' }}
                  >
                    <option value="easy" style={{ backgroundColor: '#1e293b', color: 'white' }}>Easy</option>
                    <option value="medium" style={{ backgroundColor: '#1e293b', color: 'white' }}>Medium</option>
                    <option value="hard" style={{ backgroundColor: '#1e293b', color: 'white' }}>Hard</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-300 text-sm font-medium flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Category
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value as Category)
                      generateNewText()
                    }}
                    disabled={isRunning}
                    className="appearance-none px-4 py-2.5 pr-10 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30 rounded-lg text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-500/30 hover:to-cyan-500/30 min-w-[160px] shadow-md"
                    style={{ color: 'white' }}
                  >
                    <option value="quotes" style={{ backgroundColor: '#1e293b', color: 'white' }}>Quotes</option>
                    <option value="programming" style={{ backgroundColor: '#1e293b', color: 'white' }}>Programming</option>
                    <option value="random" style={{ backgroundColor: '#1e293b', color: 'white' }}>Random</option>
                    <option value="literature" style={{ backgroundColor: '#1e293b', color: 'white' }}>Literature</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => setShowStats(!showStats)}
                  className="px-5 py-2.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-lg text-white hover:from-green-500/30 hover:to-emerald-500/30 transition-all duration-200 text-sm font-medium flex items-center gap-2 shadow-md hover:shadow-lg"
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
            </div>
          </div>

          {/* Main Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-xl p-5 border border-purple-400/30 shadow-lg">
              <div className="text-gray-300 text-sm mb-1 font-medium">WPM</div>
              <div className="text-4xl font-bold text-white">{wpm}</div>
              <div className="text-xs text-gray-400 mt-1">Net: {netWpm} | Raw: {rawWpm}</div>
            </div>
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-xl p-5 border border-green-400/30 shadow-lg">
              <div className="text-gray-300 text-sm mb-1 font-medium">Accuracy</div>
              <div className="text-4xl font-bold text-white">{accuracy}%</div>
              <div className="text-xs text-gray-400 mt-1">{text.length > 0 ? `${text.length - errors} / ${text.length} correct` : '0 / 0 correct'}</div>
            </div>
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-lg rounded-xl p-5 border border-blue-400/30 shadow-lg">
              <div className="text-gray-300 text-sm mb-1 font-medium">Time</div>
              <div className="text-4xl font-bold text-white">{timeElapsed.toFixed(1)}s</div>
              <div className="text-xs text-gray-400 mt-1">{Math.round(timeElapsed / 60)}m {Math.round(timeElapsed % 60)}s</div>
            </div>
            <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-lg rounded-xl p-5 border border-red-400/30 shadow-lg">
              <div className="text-gray-300 text-sm mb-1 font-medium">Errors</div>
              <div className="text-4xl font-bold text-white">{errors}</div>
              <div className="text-xs text-gray-400 mt-1">{consistency}% consistency</div>
            </div>
          </div>

          {/* Test Completion Message */}
          {isFinished && (
            <div className="mb-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-xl p-6 border border-green-400/30 shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-2xl font-bold text-white">Test Completed!</h2>
              </div>
              <p className="text-gray-300">
                You typed at <span className="font-bold text-green-400">{wpm} WPM</span> with{' '}
                <span className="font-bold text-green-400">{accuracy}%</span> accuracy in{' '}
                <span className="font-bold text-green-400">{timeElapsed.toFixed(1)} seconds</span>
              </p>
            </div>
          )}

          {/* Advanced Stats */}
          {showStats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 min-h-[140px] flex flex-col">
                <div className="text-gray-300 text-sm mb-2 font-medium">Performance Graph</div>
                <div className="h-24 flex items-end gap-1 flex-1">
                  {performanceData.length > 0 ? (
                    performanceData.map((point, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-t transition-all duration-300"
                        style={{ height: `${(point.wpm / maxPerformanceWpm) * 100}%` }}
                        title={`${point.wpm} WPM at ${point.time.toFixed(1)}s`}
                      />
                    ))
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <svg className="w-8 h-8 mx-auto mb-2 text-gray-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <div className="text-gray-400 text-sm">Start typing to see performance</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 min-h-[140px] flex flex-col">
                <div className="text-gray-300 text-sm mb-2 font-medium">Personal Best</div>
                <div className="flex-1 flex items-center justify-center">
                  {personalBest ? (
                    <div className="w-full">
                      <div className="text-2xl font-bold text-white">{personalBest.wpm} WPM</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {personalBest.accuracy}% accuracy • {personalBest.time.toFixed(1)}s
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(personalBest.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center w-full">
                      <svg className="w-8 h-8 mx-auto mb-2 text-gray-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                      <div className="text-gray-400 text-sm">No personal best yet</div>
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 min-h-[140px] flex flex-col">
                <div className="text-gray-300 text-sm mb-2 font-medium">Recent Tests</div>
                <div className="flex-1 overflow-y-auto">
                  {testHistory.length > 0 ? (
                    <div className="space-y-1.5">
                      {testHistory.slice(0, 5).map((test, i) => (
                        <div key={i} className="text-xs text-gray-300 bg-white/5 rounded px-2 py-1.5 border border-white/10">
                          {test.wpm} WPM • {test.accuracy}% • {test.time.toFixed(1)}s
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center w-full">
                        <svg className="w-8 h-8 mx-auto mb-2 text-gray-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="text-gray-400 text-sm">No tests yet</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Text Display */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-4 border border-white/20 overflow-hidden shadow-xl">
            <div className="text-lg leading-relaxed font-mono text-white mb-4 break-words overflow-wrap-anywhere max-w-full">
              {text.split('').map((char, index) => (
                <span
                  key={index}
                  className={`
                    ${index === currentCharIndex && !isFinished ? 'bg-yellow-400/40 border-l-2 border-yellow-400 animate-pulse' : ''}
                    ${getCharClass(index)}
                    transition-all duration-75
                  `}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </div>
            <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                style={{ width: `${(userInput.length / text.length) * 100}%` }}
              />
            </div>
          </div>

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
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 mb-4 border border-white/20">
              <div className="text-gray-300 text-sm mb-3 font-medium">Keyboard Heatmap</div>
              <div className="flex flex-wrap gap-1 justify-center">
                {Object.entries(keyPressCount)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 20)
                  .map(([key, count]) => (
                    <div
                      key={key}
                      className="px-2 py-1 rounded text-xs font-mono text-white border border-white/20 transition-all"
                      style={{
                        backgroundColor: `rgba(168, 85, 247, ${count / maxKeyPresses})`,
                        opacity: 0.7 + (count / maxKeyPresses) * 0.3,
                      }}
                      title={`${key}: ${count} presses`}
                    >
                      {key === ' ' ? 'SPACE' : key.toUpperCase()}
                    </div>
                  ))}
              </div>
            </div>
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
