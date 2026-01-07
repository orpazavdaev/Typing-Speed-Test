import React from 'react'

interface KeyboardHeatmapProps {
  keyPressCount: Record<string, number>
}

export const KeyboardHeatmap: React.FC<KeyboardHeatmapProps> = ({ keyPressCount }) => {
  const maxKeyPresses = Math.max(...Object.values(keyPressCount), 1)

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 mb-4 border border-white/20">
      <div className="text-gray-300 text-sm mb-3 font-medium">Keyboard Heatmap</div>
      <div className="flex flex-wrap gap-1 justify-center">
        {Object.entries(keyPressCount)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 20)
          .map(([key, count]) => (
            <div
              key={key}
              className="px-2 py-1 rounded text-xs font-mono text-white border border-white/20 transition-all"
              style={{
                backgroundColor: `rgba(168, 85, 247, ${count / maxKeyPresses})`,
                opacity: 0.7 + (count / maxKeyPresses) * 0.3,
              }}
              title={`${key}: ${count} presses`}
            >
              {key === ' ' ? 'SPACE' : key.toUpperCase()}
            </div>
          ))}
      </div>
    </div>
  )
}
