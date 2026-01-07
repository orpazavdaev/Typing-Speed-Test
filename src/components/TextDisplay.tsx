import React from 'react'

interface TextDisplayProps {
  text: string
  userInput: string
  currentCharIndex: number
  isFinished: boolean
}

export const TextDisplay: React.FC<TextDisplayProps> = ({
  text,
  userInput,
  currentCharIndex,
  isFinished,
}) => {
  const getCharClass = (index: number) => {
    if (index >= userInput.length) {
      return 'text-gray-400'
    }
    if (userInput[index] === text[index]) {
      return 'text-green-400 bg-green-400/20'
    }
    return 'text-red-400 bg-red-400/20 underline'
  }

  const progressPercent = text.length > 0 ? (userInput.length / text.length) * 100 : 0

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-4 border border-white/20 shadow-xl">
      <div 
        className="text-lg leading-relaxed font-mono text-white mb-4 w-full overflow-y-auto min-h-[120px] max-h-[500px] pr-2"
        style={{ 
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
          whiteSpace: 'pre-wrap',
          lineHeight: '1.8'
        }}
      >
        {text.split('').map((char, index) => (
          <span
            key={index}
            className={`
              ${index === currentCharIndex && !isFinished ? 'bg-yellow-400/40 border-l-2 border-yellow-400 animate-pulse' : ''}
              ${getCharClass(index)}
              transition-all duration-75
            `}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </div>
      <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  )
}
