import { Component, OnInit, OnDestroy, signal, computed, Inject, PLATFORM_ID } from '@angular/core';
import { WordService } from '../services/word';
import { GameStatsService } from '../services/game-stats.service';
import { ThemeService } from '../services/theme.service';
import { ShareService, GameResult } from '../services/share.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './game.html',
  styleUrls: ['./game.css']
})
export class Game implements OnInit, OnDestroy {

  readonly rows = 6;
  readonly wordLength = 5;

  randomWord = '';
  currentRow = 0;
  gameWon = false;
  gameLost = false;
  isLoading = signal(true);
  showStats = signal(false);
  showShareModal = signal(false);
  
  guesses: string[][] = Array.from({ length: this.rows }, () => Array(this.wordLength).fill(''));
  statuses: ('correct' | 'present' | 'absent' | '')[][] = Array.from({ length: this.rows }, () => Array(this.wordLength).fill(''));
  guessHistory: Array<{ guess: string; results: Array<'correct' | 'present' | 'absent'> }> = [];

  // Computed properties
  readonly canShare = computed(() => this.gameWon || this.gameLost);

  constructor(
    private wordService: WordService,
    protected statsService: GameStatsService,
    private themeService: ThemeService,
    private shareService: ShareService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loadNewWord();
  }

  get currentTheme() {
    return this.themeService.currentTheme();
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('keydown', this.keyListener);
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('keydown', this.keyListener);
    }
  }

  keyListener = (event: KeyboardEvent) => {
    if (this.gameWon || this.gameLost) return;
    
    switch(event.key) {
      case 'Enter':
        if (this.currentRow < this.rows) {
          this.checkWordExists();
        }
        break;
      case 'Escape':
        this.newGame();
        break;
    }
  };

  onInput(event: Event, row: number, col: number): void {
    const input = event.target as HTMLInputElement;
    let char = input.value.toUpperCase();

    if (!/^[A-Z]$/.test(char)) {
      input.value = '';
      return;
    }

    this.guesses[row][col] = char;
    input.value = ''; // Clear input visually

    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        if (col < this.wordLength - 1) {
          const allInputs = document.querySelectorAll('.letter-cell') as NodeListOf<HTMLInputElement>;
          const currentIndex = row * this.wordLength + col;
          const nextInput = allInputs[currentIndex + 1];
          nextInput?.focus();
        }
      }, 0);
    }
  }

  onKeyDown(event: KeyboardEvent, row: number, col: number): void {
    if (this.gameWon || this.gameLost) {
      event.preventDefault();
      return;
    }

    if (event.key === 'Backspace') {
      this.guesses[row][col] = '';

      if (isPlatformBrowser(this.platformId)) {
        const allInputs = document.querySelectorAll('.letter-cell') as NodeListOf<HTMLInputElement>;
        const currentIndex = row * this.wordLength + col;
        const prevInput = allInputs[currentIndex - 1];
        prevInput?.focus();
      }

      event.preventDefault();
    }

    if (event.key === 'Enter' && row === this.currentRow) {
      event.preventDefault();
      this.checkWordExists();
    }
  }

  checkWordExists() {
    // Prevent multiple calls
    if (this.gameWon || this.gameLost) {
      return;
    }

    const guess = this.guesses[this.currentRow].join('');
    if (guess.length !== this.wordLength) {
      alert(`Please enter a ${this.wordLength}-letter word.`);
      return;
    }

    // Mark that we're checking this row to prevent duplicate calls
    const currentRowIndex = this.currentRow;
    
    this.wordService.validateWord(guess.toLowerCase()).subscribe((valid: boolean) => {
      if (!valid) {
        alert(`"${guess}" is not a valid word.`);
      } else {
        // Double check we're still on the same row
        if (currentRowIndex === this.currentRow && !this.gameWon && !this.gameLost) {
          this.checkIfCorrect(guess);
        }
      }
    });
  }

  checkIfCorrect(guess: string) {
    const target = this.randomWord;
    const results: Array<'correct' | 'present' | 'absent'> = [];
    const currentRowIndex = this.currentRow;
    
    // Create a new statuses array to ensure proper change detection
    const newStatuses = [...this.statuses];
    
    for (let i = 0; i < this.wordLength; i++) {
      const c = guess[i];
      const status = c === target[i] ? 'correct' : target.includes(c) ? 'present' : 'absent';
      newStatuses[currentRowIndex][i] = status;
      results.push(status);
    }
    
    // Update the statuses array
    this.statuses = newStatuses;

    // Record this guess in history
    this.guessHistory.push({ guess, results });

    if (guess === target) {
      this.gameWon = true;
      this.statsService.recordGame(this.currentRow + 1, true);
      setTimeout(() => this.showShareModal.set(true), 1000);
    } else {
      // Move to next row
      this.currentRow = this.currentRow + 1;
      
      // Check if we've used all 6 rows
      if (this.currentRow >= this.rows) {
        this.gameLost = true;
        this.statsService.recordGame(this.rows, false);
        setTimeout(() => this.showShareModal.set(true), 1000);
      }
    }
  }

  newGame(): void {
    this.currentRow = 0;
    this.gameWon = false;
    this.gameLost = false;
    this.showShareModal.set(false);
    this.guesses = Array.from({ length: this.rows }, () => Array(this.wordLength).fill(''));
    this.statuses = Array.from({ length: this.rows }, () => Array(this.wordLength).fill(''));
    this.guessHistory = [];
    this.loadNewWord();
  }

  toggleStats(): void {
    this.showStats.update((show: boolean) => !show);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  shareResult(): void {
    const gameResult: GameResult = {
      gameNumber: this.statsService.currentStats().totalGames,
      guesses: this.currentRow + 1,
      maxGuesses: this.rows,
      won: this.gameWon,
      word: this.randomWord,
      guessResults: this.guessHistory
    };

    this.shareService.shareNative(gameResult);
  }

  showHint(): void {
    // Show a hint about the word
    const hints = [
      `The word starts with "${this.randomWord[0]}"`,
      `The word ends with "${this.randomWord[this.randomWord.length - 1]}"`,
      `The word contains "${this.randomWord[Math.floor(Math.random() * this.randomWord.length)]}"`,
      `The word has ${this.randomWord.length} letters`,
      `Try thinking of ${this.randomWord.toLowerCase()} words!`
    ];
    
    const randomHint = hints[Math.floor(Math.random() * hints.length)];
    alert(`💡 Hint: ${randomHint}`);
  }

  getBarWidth(count: number): number {
    const max = Math.max(...this.statsService.currentStats().guessDistribution);
    return max > 0 ? (count / max) * 100 : 0;
  }

  private loadNewWord(): void {
    this.isLoading.set(true);
    this.wordService.getRandomWord()
      .subscribe({
        next: (word: string) => {
          this.randomWord = word.toUpperCase();
          this.isLoading.set(false);
        },
        error: (error: any) => {
          console.error('Failed to load word:', error);
          this.isLoading.set(false);
          // Could implement fallback word list here
        }
      });
  }
}
