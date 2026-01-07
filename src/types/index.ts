export type Difficulty = 'easy' | 'medium' | 'hard'
export type Category = 'quotes' | 'programming' | 'random' | 'literature'

export interface TestResult {
  wpm: number
  accuracy: number
  time: number
  errors: number
  rawWpm: number
  netWpm: number
  consistency: number
  timestamp: number
}

export interface PerformancePoint {
  time: number
  wpm: number
}
