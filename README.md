# 🎮 Angular Wordle - Portfolio Project

A modern, feature-rich Wordle clone built with Angular 20, showcasing advanced frontend development skills and modern web technologies. Perfect for demonstrating expertise in responsive design, state management, and user experience optimization.

## ✨ Features

### 🎯 Core Gameplay
- **Authentic Wordle Experience** - 6 attempts, 5-letter words with real-time feedback
- **Smart Word Validation** - Hybrid validation using official Wordle words + Dictionary API
- **Intelligent Input Handling** - Auto-focus, keyboard navigation, and input validation
- **Complete Game Flow** - Allow all 6 rows, proper game over handling with hints

### 🎨 Modern UI/UX
- **Seamless Dark/Light Theme** - Instant theme switching with system preference detection
- **Fully Responsive Design** - Optimized for all screen sizes (360px to 1200px+)
- **Zero Horizontal Scrolling** - Perfect viewport management across all devices
- **Clean, Minimal Interface** - Modern design with excellent contrast and readability
- **Accessibility First** - ARIA labels, keyboard shortcuts, and screen reader support

### 📊 Advanced Features
- **Comprehensive Statistics** - Win rate, streaks, and detailed guess distribution
- **Persistent Game State** - Local storage for statistics and theme preferences
- **Smart Sharing** - Generate shareable emoji grids with native sharing API
- **Loading States** - Smooth loading indicators and graceful error handling
- **Keyboard Shortcuts** - Enter to submit, Escape for new game, Backspace to delete

### 🚀 Technical Excellence
- **Angular 20** - Latest features with signals and modern change detection
- **Optimized Performance** - Efficient state management and minimal re-renders
- **Modern Architecture** - Standalone components, services, and reactive patterns
- **Cross-Platform Compatibility** - SSR-ready with browser-specific optimizations

## 🛠️ Tech Stack

- **Frontend Framework:** Angular 20.1.0
- **Styling:** CSS3 with CSS Custom Properties and responsive design
- **State Management:** Angular Signals and RxJS Observables
- **APIs:** Official Wordle Words API + Dictionary API with fallback
- **Build Tools:** Angular CLI with modern build optimizations
- **Testing:** Jasmine & Karma with comprehensive test coverage

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/angular-wordle.git
   cd angular-wordle
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   ng serve
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200/`

## 🎮 How to Play

1. **Guess a 5-letter word** by typing letters
2. **Press Enter** to submit your guess
3. **Get color-coded feedback:**
   - 🟩 **Green**: Correct letter in correct position
   - 🟨 **Yellow**: Correct letter in wrong position
   - ⬜ **Gray**: Letter not in the word
4. **Use the feedback** to guess the word in 6 attempts!

### Keyboard Shortcuts
- **Enter** - Submit current guess
- **Escape** - Start new game
- **Backspace** - Delete last letter

## 🏗️ Project Architecture

```
src/
├── app/
│   ├── game/                    # Main game component
│   │   ├── game.ts             # Game logic and state management
│   │   ├── game.html           # Game template with modals
│   │   └── game.css            # Responsive styling with CSS variables
│   ├── services/               # Business logic services
│   │   ├── word.ts            # Word validation with API integration
│   │   ├── game-stats.service.ts # Statistics tracking and persistence
│   │   ├── theme.service.ts   # Theme management with system detection
│   │   └── share.service.ts   # Native sharing functionality
│   └── app.*                  # App configuration and routing
└── styles.css                 # Global styles and CSS variables
```

## 🎨 Design Features

### Responsive Breakpoints
- **Extra Large (1200px+)**: Enhanced layout with larger elements
- **Large (768px-1199px)**: Standard desktop experience
- **Medium (501px-767px)**: Tablet-optimized layout
- **Small (≤500px)**: Mobile-optimized with compact elements
- **Extra Small (≤360px)**: Minimal layout for small screens

### Theme System
- **Light Theme**: Clean white background with dark text
- **Dark Theme**: Dark background with white text for reduced eye strain
- **System Detection**: Automatically detects user's system preference
- **Persistent Storage**: Remembers user's theme choice

## 🧪 Testing

Run unit tests:
```bash
ng test
```

Run tests with coverage:
```bash
npm run test:coverage
```

Run tests in CI mode:
```bash
npm run test:ci
```

## 📦 Build & Deployment

Build for production:
```bash
ng build
```

Build with SSR (optional):
```bash
ng build --ssr
```

Serve production build:
```bash
ng serve --configuration production
```

## 🎯 Key Technical Decisions

### Why Angular Signals?
- **Simplified State Management** - No complex RxJS subscriptions needed
- **Better Performance** - Fine-grained reactivity with automatic change detection
- **Modern Patterns** - Aligns with current frontend development trends

### Why Standalone Components?
- **Reduced Boilerplate** - No NgModules required
- **Better Tree Shaking** - Smaller bundle sizes
- **Improved Developer Experience** - Simpler component structure

### Why Responsive-First Design?
- **Universal Accessibility** - Works on any device
- **Better User Experience** - Optimized for each screen size
- **Modern Web Standards** - Follows current best practices

### Why Hybrid API Approach?
- **Reliability** - Fallback to local word list if APIs fail
- **Performance** - Fast local validation with API backup
- **Flexibility** - Can work offline with cached words

## 🚀 Performance Optimizations

- **CSS Variables** - Efficient theme switching without re-renders
- **Signal-Based State** - Minimal change detection overhead
- **Responsive Images** - Optimized loading for different screen densities
- **Lazy Loading** - Components loaded on demand
- **Bundle Optimization** - Tree shaking and code splitting

## 🎮 Game Features in Detail

### Word Validation
- **Primary**: Official Wordle words list for authenticity
- **Secondary**: Dictionary API for additional word validation
- **Fallback**: Local word list for offline functionality

### Statistics Tracking
- **Games Played** - Total number of games
- **Win Rate** - Percentage of games won
- **Current Streak** - Consecutive wins
- **Best Streak** - Longest winning streak
- **Guess Distribution** - Visual breakdown of guess counts

### Sharing System
- **Emoji Grid** - Visual representation of game results
- **Native Sharing** - Uses Web Share API when available
- **Clipboard Fallback** - Copies to clipboard as backup
- **Social Media Ready** - Formatted for easy sharing

## 🐛 Troubleshooting

### Common Issues

**Theme not applying:**
- Clear browser cache and reload
- Check if localStorage is enabled

**Words not validating:**
- Check internet connection for API calls
- Local fallback should work offline

**Layout issues:**
- Ensure viewport meta tag is present
- Check browser zoom level (should be 100%)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Inspired by the original [Wordle](https://www.powerlanguage.co.uk/wordle/)
- Built with [Angular](https://angular.io/)
- Word lists from [FrontendExpert](https://www.frontendexpert.io/)
- Dictionary validation via [Dictionary API](https://dictionaryapi.dev/)

## 📞 Contact

For questions or feedback, feel free to reach out or open an issue!

---

**Perfect for portfolio showcases, technical interviews, and demonstrating modern Angular development skills!**

### 🏆 Portfolio Highlights

This project demonstrates expertise in:
- **Modern Angular Development** - Latest features and best practices
- **Responsive Design** - Mobile-first approach with perfect scaling
- **State Management** - Signals, services, and reactive patterns
- **User Experience** - Accessibility, performance, and usability
- **API Integration** - External services with fallback strategies
- **Testing** - Comprehensive unit test coverage
- **Performance Optimization** - Bundle size and runtime efficiency