import { useRef, useState } from 'react'
import Head from 'next/head'
import { Header } from '@/components/Header'
import { ToggleStatsButton } from '@/components/ToggleStatsButton'
import { MainStatsGrid } from '@/components/MainStatsGrid'
import { TextDisplay } from '@/components/TextDisplay'
import { TestCompletionMessage } from '@/components/TestCompletionMessage'
import { AdvancedStats } from '@/components/AdvancedStats'
import { PersonalBestCard } from '@/components/PersonalBestCard'
import { RecentTestsCard } from '@/components/RecentTestsCard'
import { InputArea } from '@/components/InputArea'
import { KeyboardHeatmap } from '@/components/KeyboardHeatmap'
import { Instructions } from '@/components/Instructions'
import { useTypingTest } from '@/hooks/useTypingTest'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'

export default function Home() {
  const [showStats, setShowStats] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const {
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
  } = useTypingTest()

  const { personalBest, testHistory, updatePersonalBest, addToHistory } = useLocalStorage()

  const handleFinishTest = (finalInput: string, finalTime: number) => {
    const result = finishTest(finalInput, finalTime)
    if (result) {
      updatePersonalBest(result)
      addToHistory(result)
    }
  }

  useKeyboardShortcuts({
    inputRef,
    isRunning,
    isFinished,
    userInput,
    onNewTest: generateNewText,
    onFinishTest: handleFinishTest,
    timeElapsedRef,
  })

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
          <Header />

          <ToggleStatsButton showStats={showStats} onToggle={() => setShowStats(!showStats)} />

          <MainStatsGrid
            wpm={wpm}
            netWpm={netWpm}
            rawWpm={rawWpm}
            accuracy={accuracy}
            textLength={text.length}
            errors={errors}
            timeElapsed={timeElapsed}
            consistency={consistency}
          />

          {isFinished && (
            <TestCompletionMessage
              wpm={wpm}
              accuracy={accuracy}
              timeElapsed={timeElapsed}
            />
          )}

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

          <TextDisplay
            text={text}
            userInput={userInput}
            currentCharIndex={currentCharIndex}
            isFinished={isFinished}
          />

          <InputArea
            inputRef={inputRef}
            value={userInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={isFinished}
            placeholder={isFinished ? "Press Tab or Esc to start a new test" : "Start typing here..."}
          />

          {showStats && Object.keys(keyPressCount).length > 0 && (
            <KeyboardHeatmap keyPressCount={keyPressCount} />
          )}

          <Instructions />
        </div>
      </main>
    </>
  )
}
