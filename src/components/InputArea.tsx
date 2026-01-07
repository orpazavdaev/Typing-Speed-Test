import React, { RefObject } from 'react'

interface InputAreaProps {
  inputRef: RefObject<HTMLTextAreaElement>
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  disabled: boolean
  placeholder: string
}

export const InputArea: React.FC<InputAreaProps> = ({
  inputRef,
  value,
  onChange,
  onKeyDown,
  disabled,
  placeholder,
}) => {
  return (
    <div className="mb-6">
      <textarea
        ref={inputRef}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full h-32 p-4 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none font-mono text-lg transition-all duration-200"
      />
    </div>
  )
}

