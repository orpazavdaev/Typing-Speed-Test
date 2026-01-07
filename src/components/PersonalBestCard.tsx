import React from 'react'
import { TestResult } from '@/types'

interface PersonalBestCardProps {
  personalBest: TestResult | null
}

export const PersonalBestCard: React.FC<PersonalBestCardProps> = ({ personalBest }) => {
  return (
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
  )
}
