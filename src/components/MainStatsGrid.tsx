import React from 'react'
import { StatsCard } from './StatsCard'

interface MainStatsGridProps {
  wpm: number
  netWpm: number
  rawWpm: number
  accuracy: number
  textLength: number
  errors: number
  timeElapsed: number
  consistency: number
}

export const MainStatsGrid: React.FC<MainStatsGridProps> = ({
  wpm,
  netWpm,
  rawWpm,
  accuracy,
  textLength,
  errors,
  timeElapsed,
  consistency,
}) => {
  return (
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
        subtitle={textLength > 0 ? `${textLength - errors} / ${textLength} correct` : '0 / 0 correct'}
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
  )
}

