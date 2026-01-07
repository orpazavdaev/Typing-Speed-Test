import React from 'react'

export const Instructions: React.FC = () => {
  return (
    <div className="mt-8 text-center text-gray-400 text-sm space-y-1">
      <p>
        Press <kbd className="px-2 py-1 bg-white/10 rounded border border-white/20">Tab</kbd> or{' '}
        <kbd className="px-2 py-1 bg-white/10 rounded border border-white/20">Esc</kbd> to start a new test
        {' • '}
        <kbd className="px-2 py-1 bg-white/10 rounded border border-white/20">Ctrl+Enter</kbd> to finish test
      </p>
      <p className="text-xs text-gray-500">
        The test ends automatically when you type all characters • A new text is generated on each refresh • Professional typing speed test with advanced analytics • Built with Next.js & TypeScript
      </p>
    </div>
  )
}

