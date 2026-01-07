import React from 'react'
import { PerformancePoint } from '@/types'

interface AdvancedStatsProps {
  performanceData: PerformancePoint[]
  errors: number
  timeElapsed: number
}

export const AdvancedStats: React.FC<AdvancedStatsProps> = ({ 
  performanceData, 
  errors, 
  timeElapsed 
}) => {
  const totalWpm = performanceData.reduce((sum, p) => sum + p.wpm, 0)
  const averageWpm = performanceData.length > 0 ? Math.round(totalWpm / performanceData.length) : 0
  const peakWpm = Math.max(...performanceData.map(p => p.wpm), 0)
  const lowestWpm = performanceData.length > 0 ? Math.min(...performanceData.map(p => p.wpm)) : 0

  const charsPerSecond = timeElapsed > 0 
    ? Math.round(performanceData.reduce((sum, p) => sum + p.wpm, 0) * 5 / (performanceData.length * 60)) 
    : 0
  const avgTimePerCharMs = charsPerSecond > 0 ? Math.round(1000 / charsPerSecond) : 0

  const errorRatePerSecond = timeElapsed > 0 ? (errors / timeElapsed).toFixed(2) : '0.00'

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Average WPM */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 min-h-[140px] flex flex-col justify-center items-center text-center">
        <div className="text-gray-300 text-sm mb-2 font-medium">Average WPM</div>
        <div className="text-4xl font-bold text-white">{averageWpm}</div>
        <div className="text-xs text-gray-400 mt-1">from {performanceData.length} data points</div>
      </div>

      {/* Peak WPM */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 min-h-[140px] flex flex-col justify-center items-center text-center">
        <div className="text-gray-300 text-sm mb-2 font-medium">Peak WPM</div>
        <div className="text-4xl font-bold text-green-400">{peakWpm}</div>
        <div className="text-xs text-gray-400 mt-1">Lowest: {lowestWpm} WPM</div>
      </div>

      {/* Chars/Second */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 min-h-[140px] flex flex-col justify-center items-center text-center">
        <div className="text-gray-300 text-sm mb-2 font-medium">Chars/Second</div>
        <div className="text-4xl font-bold text-white">{charsPerSecond}</div>
        <div className="text-xs text-gray-400 mt-1">Avg. time per char: {avgTimePerCharMs}ms</div>
      </div>

      {/* Error Rate */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 min-h-[140px] flex flex-col justify-center items-center text-center">
        <div className="text-gray-300 text-sm mb-2 font-medium">Error Rate</div>
        <div className="text-4xl font-bold text-red-400">{errorRatePerSecond} /s</div>
        <div className="text-xs text-gray-400 mt-1">Total errors: {errors}</div>
      </div>
    </div>
  )
}
