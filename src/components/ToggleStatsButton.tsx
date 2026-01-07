import React from 'react'

interface ToggleStatsButtonProps {
  showStats: boolean
  onToggle: () => void
}

export const ToggleStatsButton: React.FC<ToggleStatsButtonProps> = ({ showStats, onToggle }) => {
  return (
    <div className="flex justify-center mb-6">
      <button
        onClick={onToggle}
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
  )
}

