import React from 'react'
import { TestResult } from '@/types'

interface RecentTestsCardProps {
  testHistory: TestResult[]
}

export const RecentTestsCard: React.FC<RecentTestsCardProps> = ({ testHistory }) => {
  return (
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
  )
}
