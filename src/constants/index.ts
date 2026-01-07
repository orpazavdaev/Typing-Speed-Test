import { Category, Difficulty } from '@/types'

export const TEXT_CATEGORIES: Record<Category, string[]> = {
  quotes: [
    "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet.",
    "Programming is the art of telling another human being what one wants the computer to do.",
    "The best way to predict the future is to invent it. Computer science is no more about computers than astronomy is about telescopes.",
    "Code is like humor. When you have to explain it, it's bad. Clean code always looks like it was written by someone who cares.",
    "First, solve the problem. Then, write the code. Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
  ],
  programming: [
    "const fetchData = async () => { const response = await fetch('/api/data'); return response.json(); }",
    "function binarySearch(arr, target) { let left = 0, right = arr.length - 1; while (left <= right) { const mid = Math.floor((left + right) / 2); if (arr[mid] === target) return mid; arr[mid] < target ? left = mid + 1 : right = mid - 1; } return -1; }",
    "class Component extends React.Component { constructor(props) { super(props); this.state = { count: 0 }; } render() { return <div>{this.state.count}</div>; } }",
    "const debounce = (func, wait) => { let timeout; return function executedFunction(...args) { const later = () => { clearTimeout(timeout); func(...args); }; clearTimeout(timeout); timeout = setTimeout(later, wait); }; };",
    "interface User { id: number; name: string; email: string; } const users: User[] = [{ id: 1, name: 'John', email: 'john@example.com' }];",
  ],
  random: [
    "The mysterious package arrived on a Tuesday morning, wrapped in brown paper and tied with string. Inside, there was nothing but a single key and a note that read: 'The adventure begins now.'",
    "She walked through the ancient forest, where sunlight filtered through the canopy in golden streams. Every step crunched on fallen leaves, and the air smelled of damp earth and pine.",
    "The old lighthouse stood tall against the stormy sky, its beam cutting through the darkness like a sword. Waves crashed against the rocky shore, sending spray high into the air.",
    "In the heart of the city, neon signs flickered to life as dusk settled. Crowds of people moved like rivers through the streets, each person lost in their own world of thoughts and destinations.",
    "The recipe called for three cups of flour, two eggs, and a pinch of magic. As she mixed the ingredients, the batter began to glow with an otherworldly light, promising something extraordinary.",
  ],
  literature: [
    "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity.",
    "In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends of worms and an oozy smell, nor yet a dry, bare, sandy hole with nothing in it to sit down on or to eat: it was a hobbit-hole, and that means comfort.",
    "Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world.",
    "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife. However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families.",
    "The sun was shining on the sea, shining with all his might: He did his very best to make the billows smooth and bright—And this was odd, because it was the middle of the night.",
  ],
}

export const DIFFICULTY_LENGTHS: Record<Difficulty, number> = {
  easy: 50,
  medium: 100,
  hard: 200,
}
