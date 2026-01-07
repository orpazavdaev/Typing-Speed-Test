import React from 'react'
import { Difficulty, Category } from '@/types'

interface SettingsPanelProps {
  difficulty: Difficulty
  category: Category
  isRunning: boolean
  showStats: boolean
  onDifficultyChange: (difficulty: Difficulty) => void
  onCategoryChange: (category: Category) => void
  onToggleStats: () => void
  onGenerateNewText: () => void
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  difficulty,
  category,
  isRunning,
  showStats,
  onDifficultyChange,
  onCategoryChange,
  onToggleStats,
  onGenerateNewText,
}) => {
  return (
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
                onDifficultyChange(e.target.value as Difficulty)
                onGenerateNewText()
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
                onCategoryChange(e.target.value as Category)
                onGenerateNewText()
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
            onClick={onToggleStats}
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
  )
}
