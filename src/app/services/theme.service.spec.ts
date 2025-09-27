import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';
import { PLATFORM_ID } from '@angular/core';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });
    service = TestBed.inject(ThemeService);
    
    // Clear localStorage and reset DOM
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    if (typeof document !== 'undefined') {
      document.documentElement.removeAttribute('data-theme');
      document.documentElement.classList.remove('light-theme', 'dark-theme');
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should default to dark theme', () => {
    expect(service.currentTheme()).toBe('dark');
  });

  it('should toggle theme correctly', () => {
    expect(service.currentTheme()).toBe('dark');
    
    service.toggleTheme();
    expect(service.currentTheme()).toBe('light');
    
    service.toggleTheme();
    expect(service.currentTheme()).toBe('dark');
  });

  it('should set theme correctly', () => {
    service.setTheme('light');
    expect(service.currentTheme()).toBe('light');
    
    service.setTheme('dark');
    expect(service.currentTheme()).toBe('dark');
  });

  it('should apply theme to document', () => {
    if (typeof document !== 'undefined') {
      service.setTheme('light');
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
      expect(document.documentElement.classList.contains('light-theme')).toBe(true);
      
      service.setTheme('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      expect(document.documentElement.classList.contains('dark-theme')).toBe(true);
    }
  });

  it('should persist theme to localStorage', () => {
    service.setTheme('light');
    
    if (typeof localStorage !== 'undefined') {
      const savedTheme = localStorage.getItem('wordle-theme');
      expect(savedTheme).toBe('light');
    }
  });

  it('should load theme from localStorage', () => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('wordle-theme', 'light');
      
      // Create new service instance to test loading
      const newService = new ThemeService('browser');
      expect(newService.currentTheme()).toBe('light');
    }
  });

  it('should handle invalid saved theme gracefully', () => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('wordle-theme', 'invalid-theme');
      
      // Create new service instance
      const newService = new ThemeService('browser');
      expect(['dark', 'light']).toContain(newService.currentTheme());
    }
  });

  it('should detect system preference when no saved theme', () => {
    if (typeof window !== 'undefined') {
      // Mock system preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jasmine.createSpy('matchMedia').and.returnValue({
          matches: true,
          media: '(prefers-color-scheme: dark)',
          onchange: null,
          addListener: jasmine.createSpy(),
          removeListener: jasmine.createSpy(),
          addEventListener: jasmine.createSpy(),
          removeEventListener: jasmine.createSpy(),
          dispatchEvent: jasmine.createSpy(),
        }),
      });

      // Create new service instance
      const newService = new ThemeService('browser');
      expect(newService.currentTheme()).toBe('dark');
    }
  });

  it('should handle localStorage errors gracefully', () => {
    if (typeof localStorage !== 'undefined') {
      // Mock localStorage to throw error
      const originalGetItem = localStorage.getItem;
      localStorage.getItem = jasmine.createSpy('getItem').and.throwError('Storage error');

      // Should not throw error
      expect(() => new ThemeService('browser')).not.toThrow();
      
      // Restore original method
      localStorage.getItem = originalGetItem;
    }
  });
});
