import { TestBed } from '@angular/core/testing';
import { GameStatsService } from './game-stats.service';
import { PLATFORM_ID } from '@angular/core';

describe('GameStatsService', () => {
  let service: GameStatsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });
    service = TestBed.inject(GameStatsService);
    
    // Clear localStorage before each test
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default stats', () => {
    const stats = service.currentStats();
    expect(stats.totalGames).toBe(0);
    expect(stats.wins).toBe(0);
    expect(stats.currentStreak).toBe(0);
    expect(stats.bestStreak).toBe(0);
    expect(stats.guessDistribution).toEqual([0, 0, 0, 0, 0, 0]);
  });

  it('should record a won game correctly', () => {
    service.recordGame(3, true);
    
    const stats = service.currentStats();
    expect(stats.totalGames).toBe(1);
    expect(stats.wins).toBe(1);
    expect(stats.currentStreak).toBe(1);
    expect(stats.bestStreak).toBe(1);
    expect(stats.guessDistribution[2]).toBe(1); // 3rd guess (index 2)
  });

  it('should record a lost game correctly', () => {
    service.recordGame(6, false);
    
    const stats = service.currentStats();
    expect(stats.totalGames).toBe(1);
    expect(stats.wins).toBe(0);
    expect(stats.currentStreak).toBe(0);
    expect(stats.bestStreak).toBe(0);
    expect(stats.guessDistribution).toEqual([0, 0, 0, 0, 0, 0]); // No wins to track
  });

  it('should calculate win rate correctly', () => {
    service.recordGame(3, true);
    service.recordGame(4, true);
    service.recordGame(6, false);
    
    expect(service.winRate()).toBe(67); // 2 wins out of 3 games
  });

  it('should maintain current streak correctly', () => {
    service.recordGame(3, true);
    service.recordGame(4, true);
    service.recordGame(2, true);
    
    const stats = service.currentStats();
    expect(stats.currentStreak).toBe(3);
    expect(stats.bestStreak).toBe(3);
  });

  it('should reset current streak on loss', () => {
    service.recordGame(3, true);
    service.recordGame(4, true);
    service.recordGame(6, false);
    
    const stats = service.currentStats();
    expect(stats.currentStreak).toBe(0);
    expect(stats.bestStreak).toBe(2); // Should maintain best streak
  });

  it('should persist stats to localStorage', () => {
    service.recordGame(3, true);
    
    const savedStats = localStorage.getItem('wordle-game-stats');
    expect(savedStats).toBeTruthy();
    
    const parsedStats = JSON.parse(savedStats!);
    expect(parsedStats.totalGames).toBe(1);
    expect(parsedStats.wins).toBe(1);
  });

  it('should load stats from localStorage', () => {
    const testStats = {
      totalGames: 5,
      wins: 3,
      currentStreak: 2,
      bestStreak: 3,
      guessDistribution: [0, 1, 1, 1, 0, 0],
      averageGuesses: 3.5,
      lastPlayed: new Date().toISOString()
    };
    
    localStorage.setItem('wordle-game-stats', JSON.stringify(testStats));
    
    // Create new service instance to test loading
    const newService = new GameStatsService('browser');
    
    const stats = newService.currentStats();
    expect(stats.totalGames).toBe(5);
    expect(stats.wins).toBe(3);
    expect(stats.currentStreak).toBe(2);
    expect(stats.bestStreak).toBe(3);
  });

  it('should reset stats correctly', () => {
    service.recordGame(3, true);
    service.recordGame(4, true);
    
    service.resetStats();
    
    const stats = service.currentStats();
    expect(stats.totalGames).toBe(0);
    expect(stats.wins).toBe(0);
    expect(stats.currentStreak).toBe(0);
    expect(stats.bestStreak).toBe(0);
  });
});
