# 🚀 Advanced Typing Speed Test

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?style=for-the-badge&logo=typescript)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)

**A professional, feature-rich typing speed test application built with modern web technologies**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Project Structure](#-project-structure)

</div>

---

## 📋 Overview

Advanced Typing Speed Test is a sophisticated web application designed to measure and analyze typing performance. Built with Next.js and TypeScript, it provides real-time statistics, performance tracking, and a beautiful, responsive user interface. This project demonstrates modern React patterns, custom hooks, component architecture, and state management best practices.

### Key Highlights

- ⚡ **Real-time Performance Tracking** - Live WPM calculation and accuracy monitoring
- 📊 **Advanced Analytics** - Comprehensive statistics including consistency, error rate, and performance graphs
- 🎨 **Modern UI/UX** - Beautiful gradient design with smooth animations and responsive layout
- 💾 **Data Persistence** - LocalStorage integration for personal bests and test history
- ⌨️ **Keyboard Shortcuts** - Intuitive shortcuts for better user experience
- 🧩 **Modular Architecture** - Clean component structure with custom hooks for maintainability

---

## ✨ Features

### Core Functionality
- **Real-time WPM Calculation** - Words Per Minute tracking with both raw and net WPM
- **Accuracy Measurement** - Character-by-character accuracy calculation
- **Error Tracking** - Detailed error count and analysis
- **Timer System** - Precise timing with automatic test completion
- **Random Text Generation** - Diverse text collection for varied practice

### Advanced Features
- **Performance Analytics** - Real-time performance data collection and visualization
- **Personal Best Tracking** - Save and display your best performance
- **Test History** - View your last 10 test results
- **Consistency Score** - Measure typing consistency across the test
- **Keyboard Heatmap** - Visual representation of key press frequency
- **Advanced Statistics Panel** - Toggleable detailed stats view

### User Experience
- **Responsive Design** - Fully responsive across all device sizes
- **Keyboard Shortcuts**:
  - `Tab` / `Esc` - Start a new test
  - `Ctrl+Enter` / `Cmd+Enter` - Finish current test
- **Auto-completion** - Test automatically ends when all text is typed
- **Visual Feedback** - Color-coded character highlighting for correct/incorrect input

---

## 🛠️ Tech Stack

### Frontend Framework
- **Next.js 14** - React framework with SSR and optimized performance
- **React 18** - Modern React with hooks and functional components
- **TypeScript 5.2** - Type-safe development

### Styling
- **Tailwind CSS 3.3** - Utility-first CSS framework
- **Custom Animations** - Smooth transitions and gradient effects

### Architecture
- **Component-Based Design** - Modular, reusable components
- **Custom Hooks** - Separated business logic from UI components
- **TypeScript Interfaces** - Strong typing throughout the application

### Data Management
- **LocalStorage API** - Client-side data persistence
- **React Hooks** - useState, useEffect, useRef, useCallback for state management

---

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/typing-speed-test.git
   cd typing-speed-test
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

---

## 📁 Project Structure

```
typing-speed-test/
├── src/
│   ├── components/          # React components
│   │   ├── Header.tsx       # Application header
│   │   ├── MainStatsGrid.tsx # Main statistics cards
│   │   ├── TextDisplay.tsx  # Text display with highlighting
│   │   ├── InputArea.tsx    # Text input component
│   │   ├── AdvancedStats.tsx # Advanced statistics panel
│   │   ├── PersonalBestCard.tsx # Personal best display
│   │   ├── RecentTestsCard.tsx  # Test history display
│   │   ├── KeyboardHeatmap.tsx  # Keyboard visualization
│   │   ├── TestCompletionMessage.tsx # Completion notification
│   │   ├── ToggleStatsButton.tsx # Stats toggle button
│   │   ├── Instructions.tsx # User instructions
│   │   └── StatsCard.tsx    # Reusable stat card component
│   │
│   ├── hooks/               # Custom React hooks
│   │   ├── useTypingTest.ts # Main typing test logic
│   │   ├── useLocalStorage.ts # LocalStorage management
│   │   └── useKeyboardShortcuts.ts # Keyboard shortcuts handler
│   │
│   ├── pages/               # Next.js pages
│   │   ├── _app.tsx        # App wrapper
│   │   └── index.tsx       # Main application page
│   │
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts        # Type interfaces
│   │
│   ├── constants/           # Application constants
│   │   └── index.ts        # Text collection and constants
│   │
│   └── styles/              # Global styles
│       └── globals.css     # Global CSS and Tailwind imports
│
├── public/                  # Static assets
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
```

---

## 🏗️ Architecture

### Component Architecture
The application follows a modular component architecture:

- **Presentational Components** - Handle UI rendering (Header, StatsCard, etc.)
- **Container Components** - Manage state and logic (index.tsx)
- **Custom Hooks** - Encapsulate business logic (useTypingTest, useLocalStorage)

### State Management
- **React Hooks** - useState for component state
- **useRef** - For mutable values that don't trigger re-renders
- **useCallback** - Memoized functions to prevent unnecessary re-renders
- **LocalStorage** - Persistent data storage

### Key Design Patterns
- **Separation of Concerns** - Logic separated from UI components
- **Custom Hooks Pattern** - Reusable business logic
- **Component Composition** - Small, focused components
- **Type Safety** - Full TypeScript coverage

---

## 🎯 Key Features Implementation

### Real-time WPM Calculation
- Calculates WPM based on character count (5 characters = 1 word)
- Tracks both raw WPM (total words) and net WPM (adjusted for accuracy)
- Updates every 100ms for smooth real-time feedback

### Performance Tracking
- Collects performance data points every second
- Stores data for visualization and analysis
- Calculates consistency based on WPM variance

### Error Detection
- Character-by-character comparison
- Real-time error counting
- Accuracy calculation based on correct characters

### Data Persistence
- Saves personal best automatically
- Maintains test history (last 10 tests)
- Uses LocalStorage for client-side persistence

---

## 🚀 Performance Optimizations

- **Code Splitting** - Next.js automatic code splitting
- **Memoization** - useCallback for expensive functions
- **Refs for Timers** - Prevents unnecessary re-renders
- **Efficient State Updates** - Batched state updates where possible
- **Optimized Re-renders** - Component isolation prevents cascade re-renders

---

## 📝 Usage

1. **Start Typing** - Begin typing the displayed text
2. **Monitor Stats** - Watch real-time WPM, accuracy, and time
3. **View Advanced Stats** - Toggle advanced statistics panel
4. **Track Progress** - View personal best and test history
5. **Keyboard Shortcuts**:
   - Press `Tab` or `Esc` to start a new test
   - Press `Ctrl+Enter` (or `Cmd+Enter` on Mac) to finish early

---

## 🔮 Future Enhancements

Potential features for future development:

- [ ] User accounts and cloud sync
- [ ] Multiple test modes (time-based, word count-based)
- [ ] Social features (leaderboards, sharing results)
- [ ] Custom text import
- [ ] Detailed analytics dashboard
- [ ] Practice mode with error correction
- [ ] Multi-language support
- [ ] Dark/Light theme toggle

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**⭐ If you find this project useful, please consider giving it a star! ⭐**

</div>
