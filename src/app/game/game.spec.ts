import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Game } from './game';
import { WordService } from '../services/word';
import { GameStatsService } from '../services/game-stats.service';
import { ThemeService } from '../services/theme.service';
import { ShareService } from '../services/share.service';

describe('Game', () => {
  let component: Game;
  let fixture: ComponentFixture<Game>;
  let wordService: jasmine.SpyObj<WordService>;
  let statsService: jasmine.SpyObj<GameStatsService>;
  let themeService: jasmine.SpyObj<ThemeService>;
  let shareService: jasmine.SpyObj<ShareService>;

  beforeEach(async () => {
    const wordServiceSpy = jasmine.createSpyObj('WordService', ['getRandomWord', 'validateWord']);
    const statsServiceSpy = jasmine.createSpyObj('GameStatsService', ['recordGame'], {
      currentStats: jasmine.createSpy().and.returnValue({
        totalGames: 0,
        wins: 0,
        currentStreak: 0,
        bestStreak: 0,
        guessDistribution: [0, 0, 0, 0, 0, 0],
        averageGuesses: 0,
        lastPlayed: null
      }),
      winRate: jasmine.createSpy().and.returnValue(0)
    });
    const themeServiceSpy = jasmine.createSpyObj('ThemeService', ['toggleTheme'], {
      currentTheme: jasmine.createSpy().and.returnValue('dark')
    });
    const shareServiceSpy = jasmine.createSpyObj('ShareService', ['shareNative']);

    await TestBed.configureTestingModule({
      imports: [Game],
      providers: [
        { provide: WordService, useValue: wordServiceSpy },
        { provide: GameStatsService, useValue: statsServiceSpy },
        { provide: ThemeService, useValue: themeServiceSpy },
        { provide: ShareService, useValue: shareServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Game);
    component = fixture.componentInstance;
    
    wordService = TestBed.inject(WordService) as jasmine.SpyObj<WordService>;
    statsService = TestBed.inject(GameStatsService) as jasmine.SpyObj<GameStatsService>;
    themeService = TestBed.inject(ThemeService) as jasmine.SpyObj<ThemeService>;
    shareService = TestBed.inject(ShareService) as jasmine.SpyObj<ShareService>;

    // Mock successful word loading
    wordService.getRandomWord.and.returnValue(of('TESTS'));
    wordService.validateWord.and.returnValue(of(true));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct default values', () => {
    expect(component.currentRow).toBe(0);
    expect(component.gameWon).toBeFalse();
    expect(component.gameLost).toBeFalse();
    expect(component.rows).toBe(6);
    expect(component.wordLength).toBe(5);
  });

  it('should load random word on initialization', () => {
    expect(wordService.getRandomWord).toHaveBeenCalled();
    expect(component.randomWord).toBe('TESTS');
  });

  it('should validate word before checking correctness', () => {
    const testGuess = 'HELLO';
    
    component.checkWordExists();
    
    expect(wordService.validateWord).toHaveBeenCalledWith('hello');
  });

  it('should handle correct word guess', () => {
    component.randomWord = 'TESTS';
    component.guesses[0] = ['T', 'E', 'S', 'T', 'S'];
    
    component.checkIfCorrect('TESTS');
    
    expect(component.gameWon).toBeTrue();
    expect(statsService.recordGame).toHaveBeenCalledWith(1, true);
  });

  it('should handle incorrect word guess', () => {
    component.randomWord = 'TESTS';
    component.guesses[0] = ['H', 'E', 'L', 'L', 'O'];
    
    component.checkIfCorrect('HELLO');
    
    expect(component.gameWon).toBeFalse();
    expect(component.currentRow).toBe(1);
    expect(component.statuses[0]).toEqual(['absent', 'present', 'absent', 'absent', 'absent']);
  });

  it('should handle game loss after 6 attempts', () => {
    component.currentRow = 5;
    component.randomWord = 'TESTS';
    component.guesses[5] = ['W', 'R', 'O', 'N', 'G'];
    
    component.checkIfCorrect('WRONG');
    
    expect(component.gameLost).toBeTrue();
    expect(statsService.recordGame).toHaveBeenCalledWith(6, false);
  });

  it('should toggle theme when toggleTheme is called', () => {
    component.toggleTheme();
    
    expect(themeService.toggleTheme).toHaveBeenCalled();
  });

  it('should toggle stats modal when toggleStats is called', () => {
    expect(component.showStats()).toBeFalse();
    
    component.toggleStats();
    
    expect(component.showStats()).toBeTrue();
  });

  it('should start new game when newGame is called', () => {
    component.gameWon = true;
    component.currentRow = 3;
    
    component.newGame();
    
    expect(component.gameWon).toBeFalse();
    expect(component.gameLost).toBeFalse();
    expect(component.currentRow).toBe(0);
    expect(component.showShareModal()).toBeFalse();
  });

  it('should share result when shareResult is called', () => {
    component.gameWon = true;
    component.randomWord = 'TESTS';
    component.guessHistory = [
      { guess: 'HELLO', results: ['absent', 'present', 'absent', 'absent', 'absent'] },
      { guess: 'TESTS', results: ['correct', 'correct', 'correct', 'correct', 'correct'] }
    ];
    
    component.shareResult();
    
    expect(shareService.shareNative).toHaveBeenCalled();
  });

  it('should handle keyboard shortcuts correctly', () => {
    spyOn(component, 'checkWordExists');
    spyOn(component, 'newGame');
    
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    
    component.keyListener(enterEvent);
    expect(component.checkWordExists).toHaveBeenCalled();
    
    component.keyListener(escapeEvent);
    expect(component.newGame).toHaveBeenCalled();
  });

  it('should not respond to keyboard events when game is over', () => {
    component.gameWon = true;
    spyOn(component, 'checkWordExists');
    
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    component.keyListener(enterEvent);
    
    expect(component.checkWordExists).not.toHaveBeenCalled();
  });

  it('should handle API errors gracefully', () => {
    wordService.getRandomWord.and.returnValue(throwError('API Error'));
    
    // Should not throw error when calling the public method that uses loadNewWord
    expect(() => component.newGame()).not.toThrow();
  });
});
