import React from 'react'

interface TestCompletionMessageProps {
  wpm: number
  accuracy: number
  timeElapsed: number
}

export const TestCompletionMessage: React.FC<TestCompletionMessageProps> = ({
  wpm,
  accuracy,
  timeElapsed,
}) => {
  return (
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
  )
}

