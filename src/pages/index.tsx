import { useState, useEffect, useRef, useCallback } from 'react'
import Head from 'next/head'

const SAMPLE_TEXTS = [
  "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet.",
  "Programming is the art of telling another human being what one wants the computer to do.",
  "The best way to predict the future is to invent it. Computer science is no more about computers than astronomy is about telescopes.",
  "Code is like humor. When you have to explain it, it's bad. Clean code always looks like it was written by someone who cares.",
  "First, solve the problem. Then, write the code. Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
  "The most disastrous thing that you can ever learn is your first programming language. It will forever shape the way you think about programming.",
  "Software is a great combination between artistry and engineering. When you finally get done and get to appreciate what you have done it is really a great feeling.",
  "The computer was born to solve problems that did not exist before. The goal of a software architect is to minimize the amount of knowledge needed to build a system.",
]

export default function Home() {
  const [text, setText] = useState('')
  const [userInput, setUserInput] = useState('')
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [errors, setErrors] = useState(0)
  const [currentCharIndex, setCurrentCharIndex] = useState(0)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const generateNewText = useCallback(() => {
    const randomText = SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)]
    setText(randomText)
    setUserInput('')
    setTimeElapsed(0)
    setIsRunning(false)
    setIsFinished(false)
    setWpm(0)
    setAccuracy(100)
    setErrors(0)
    setCurrentCharIndex(0)
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }, [])

  useEffect(() => {
    generateNewText()
  }, [generateNewText])

  useEffect(() => {
    if (isRunning && !isFinished) {
      timerRef.current = setInterval(() => {
        setTimeElapsed((prev) => prev + 0.1)
      }, 100)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isRunning, isFinished])

  const calculateStats = useCallback((input: string) => {
    const words = input.trim().split(/\s+/).filter((word) => word.length > 0)
    const minutes = timeElapsed / 60
    const calculatedWpm = minutes > 0 ? Math.round(words.length / minutes) : 0

    let errorCount = 0
    for (let i = 0; i < input.length; i++) {
      if (input[i] !== text[i]) {
        errorCount++
      }
    }
    const calculatedAccuracy = input.length > 0
      ? Math.max(0, Math.round(((input.length - errorCount) / input.length) * 100))
      : 100

    setWpm(calculatedWpm)
    setAccuracy(calculatedAccuracy)
    setErrors(errorCount)
  }, [text, timeElapsed])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value

    if (!isRunning && value.length > 0) {
      setIsRunning(true)
    }

    if (value.length <= text.length) {
      setUserInput(value)
      setCurrentCharIndex(value.length)

      // Check if finished
      if (value === text) {
        setIsFinished(true)
        setIsRunning(false)
        calculateStats(value)
      } else if (isRunning) {
        calculateStats(value)
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      generateNewText()
    }
  }

  const getCharClass = (index: number) => {
    if (index >= userInput.length) {
      return 'text-gray-400'
    }
    if (userInput[index] === text[index]) {
      return 'text-green-400 bg-green-400/20'
    }
    return 'text-red-400 bg-red-400/20'
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
        <title>Typing Speed Test</title>
        <meta name="description" content="Test your typing speed and accuracy" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Typing Speed Test
            </h1>
            <p className="text-gray-300">Test your typing speed and accuracy</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
              <div className="text-gray-300 text-sm mb-1">WPM</div>
              <div className="text-3xl font-bold text-white">{wpm}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
              <div className="text-gray-300 text-sm mb-1">Accuracy</div>
              <div className="text-3xl font-bold text-white">{accuracy}%</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
              <div className="text-gray-300 text-sm mb-1">Time</div>
              <div className="text-3xl font-bold text-white">{timeElapsed.toFixed(1)}s</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
              <div className="text-gray-300 text-sm mb-1">Errors</div>
              <div className="text-3xl font-bold text-white">{errors}</div>
            </div>
          </div>

          {/* Text Display */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-4 border border-white/20 overflow-hidden">
            <div className="text-lg leading-relaxed font-mono text-white mb-4 break-words overflow-wrap-anywhere max-w-full">
              {text.split('').map((char, index) => (
                <span
                  key={index}
                  className={`
                    ${index === currentCharIndex && !isFinished ? 'bg-yellow-400/30 border-l-2 border-yellow-400' : ''}
                    ${getCharClass(index)}
                    transition-all duration-75
                  `}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
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
              className="w-full h-32 p-4 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none font-mono text-lg"
            />
          </div>

          {/* Controls */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={resetTest}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Reset Test
            </button>
            {isFinished && (
              <div className="px-6 py-3 bg-green-500/20 border border-green-400/50 text-green-300 font-semibold rounded-xl flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Test Completed!
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-8 text-center text-gray-400 text-sm">
            <p>Press <kbd className="px-2 py-1 bg-white/10 rounded border border-white/20">Tab</kbd> to start a new test</p>
          </div>
        </div>
      </main>
    </>
  )
}

