import React from 'react'

export const Header: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-6xl font-bold text-white mb-3 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-pulse-slow">
        Advanced Typing Test
      </h1>
      <p className="text-gray-300 text-lg">Test your typing speed with professional analytics</p>
    </div>
  )
}

