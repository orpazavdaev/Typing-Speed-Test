import { useEffect, RefObject } from 'react'

interface UseKeyboardShortcutsProps {
  inputRef: RefObject<HTMLTextAreaElement>
  isRunning: boolean
  isFinished: boolean
  userInput: string
  onNewTest: () => void
  onFinishTest: (input: string, time: number) => void
  timeElapsedRef: React.MutableRefObject<number>
}

export const useKeyboardShortcuts = ({
  inputRef,
  isRunning,
  isFinished,
  userInput,
  onNewTest,
  onFinishTest,
  timeElapsedRef,
}: UseKeyboardShortcutsProps) => {
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab' || e.key === 'Escape') {
        e.preventDefault()
        onNewTest()
        if (inputRef.current) {
          inputRef.current.focus()
        }
      }
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        if (isRunning && !isFinished) {
          onFinishTest(userInput, timeElapsedRef.current)
        }
      }
    }

    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown)
    }
  }, [isRunning, isFinished, userInput, onNewTest, onFinishTest, inputRef, timeElapsedRef])
}

