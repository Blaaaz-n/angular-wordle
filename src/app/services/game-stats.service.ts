import { Injectable, signal, computed, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface GameStats {
  totalGames: number;
  wins: number;
  currentStreak: number;
  bestStreak: number;
  guessDistribution: number[];
  averageGuesses: number;
  lastPlayed: Date | null;
}

@Injectable({
  providedIn: 'root'
})
export class GameStatsService {
  private readonly STORAGE_KEY = 'wordle-game-stats';
  
  private stats = signal<GameStats>({
    totalGames: 0,
    wins: 0,
    currentStreak: 0,
    bestStreak: 0,
    guessDistribution: [0, 0, 0, 0, 0, 0], // guesses 1-6
    averageGuesses: 0,
    lastPlayed: null
  });

  // Computed properties
  readonly winRate = computed(() => {
    const s = this.stats();
    return s.totalGames > 0 ? Math.round((s.wins / s.totalGames) * 100) : 0;
  });

  readonly currentStats = computed(() => this.stats());

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.loadStats();
    }
  }

  recordGame(guesses: number, won: boolean): void {
    const currentStats = this.stats();
    const newStats: GameStats = {
      totalGames: currentStats.totalGames + 1,
      wins: won ? currentStats.wins + 1 : currentStats.wins,
      currentStreak: won ? currentStats.currentStreak + 1 : 0,
      bestStreak: won ? Math.max(currentStats.bestStreak, currentStats.currentStreak + 1) : currentStats.bestStreak,
      guessDistribution: won ? this.updateGuessDistribution(currentStats.guessDistribution, guesses - 1) : currentStats.guessDistribution,
      averageGuesses: this.calculateAverageGuesses(currentStats, guesses, won),
      lastPlayed: new Date()
    };

    this.stats.set(newStats);
    this.saveStats();
  }

  private updateGuessDistribution(distribution: number[], guessIndex: number): number[] {
    const newDistribution = [...distribution];
    if (guessIndex >= 0 && guessIndex < 6) {
      newDistribution[guessIndex]++;
    }
    return newDistribution;
  }

  private calculateAverageGuesses(currentStats: GameStats, guesses: number, won: boolean): number {
    if (!won) return currentStats.averageGuesses;
    
    const totalGuesses = (currentStats.averageGuesses * currentStats.wins) + guesses;
    return Math.round((totalGuesses / (currentStats.wins + 1)) * 10) / 10;
  }

  private loadStats(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        parsed.lastPlayed = parsed.lastPlayed ? new Date(parsed.lastPlayed) : null;
        this.stats.set(parsed);
      }
    } catch (error) {
      console.error('Failed to load game stats:', error);
    }
  }

  private saveStats(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.stats()));
    } catch (error) {
      console.error('Failed to save game stats:', error);
    }
  }

  resetStats(): void {
    this.stats.set({
      totalGames: 0,
      wins: 0,
      currentStreak: 0,
      bestStreak: 0,
      guessDistribution: [0, 0, 0, 0, 0, 0],
      averageGuesses: 0,
      lastPlayed: null
    });
    this.saveStats();
  }
}
