import React from 'react'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle: string
  gradientFrom: string
  gradientTo: string
  borderColor: string
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  gradientFrom,
  gradientTo,
  borderColor,
}) => {
  return (
    <div className={`bg-gradient-to-br ${gradientFrom} ${gradientTo} backdrop-blur-lg rounded-xl p-6 border ${borderColor} shadow-xl min-h-[140px] flex flex-col justify-center transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]`}>
      <div className="text-gray-300 text-sm mb-2 font-semibold uppercase tracking-wide">{title}</div>
      <div className="text-5xl font-bold text-white mb-2">{value}</div>
      <div className="text-xs text-gray-400 mt-1 leading-relaxed">{subtitle}</div>
    </div>
  )
}
