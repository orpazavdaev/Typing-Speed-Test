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
    <div className={`bg-gradient-to-br ${gradientFrom} ${gradientTo} backdrop-blur-lg rounded-xl p-5 border ${borderColor} shadow-lg min-h-[120px] flex flex-col justify-center`}>
      <div className="text-gray-300 text-sm mb-1 font-medium">{title}</div>
      <div className="text-4xl font-bold text-white">{value}</div>
      <div className="text-xs text-gray-400 mt-1">{subtitle}</div>
    </div>
  )
}
