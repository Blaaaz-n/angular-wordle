import { Injectable, signal, effect, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'wordle-theme';
  private readonly DEFAULT_THEME: Theme = 'dark';
  
  private theme = signal<Theme>(this.DEFAULT_THEME);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.loadTheme();
      
      // Apply theme changes to document
      effect(() => {
        const currentTheme = this.theme();
        this.applyTheme(currentTheme);
      });
    }
  }

  get currentTheme() {
    return this.theme;
  }

  toggleTheme(): void {
    const newTheme: Theme = this.theme() === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  setTheme(theme: Theme): void {
    this.theme.set(theme);
    this.saveTheme();
  }

  private loadTheme(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY) as Theme;
      if (saved && (saved === 'light' || saved === 'dark')) {
        this.theme.set(saved);
      } else {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.theme.set(prefersDark ? 'dark' : 'light');
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
      this.theme.set(this.DEFAULT_THEME);
    }
  }

  private saveTheme(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    try {
      localStorage.setItem(this.STORAGE_KEY, this.theme());
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  }

  private applyTheme(theme: Theme): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    console.log('Applying theme:', theme);
    
    // Remove all theme classes and attributes first
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.classList.remove('light-theme', 'dark-theme');
    
    // Apply new theme
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.add(theme === 'light' ? 'light-theme' : 'dark-theme');
    
    // Apply CSS variables directly to document element
    if (theme === 'light') {
      document.documentElement.style.setProperty('--bg-primary', '#ffffff');
      document.documentElement.style.setProperty('--bg-secondary', '#f8f9fa');
      document.documentElement.style.setProperty('--bg-tertiary', '#e9ecef');
      document.documentElement.style.setProperty('--text-primary', '#000000');
      document.documentElement.style.setProperty('--text-secondary', '#495057');
      document.documentElement.style.setProperty('--text-muted', '#6c757d');
      document.documentElement.style.setProperty('--border-color', '#d3d6da');
      document.documentElement.style.setProperty('--border-light', '#dee2e6');
      document.documentElement.style.setProperty('--correct-color', '#6aaa64');
      document.documentElement.style.setProperty('--present-color', '#f7b731');
      document.documentElement.style.setProperty('--absent-color', '#787c7e');
      document.documentElement.style.setProperty('--modal-content-bg', '#ffffff');
      document.documentElement.style.setProperty('--shadow', 'rgba(0, 0, 0, 0.1)');
      
      // Apply background directly to html and body elements
      document.documentElement.style.backgroundColor = '#ffffff';
      document.body.style.backgroundColor = '#ffffff';
    } else {
      document.documentElement.style.setProperty('--bg-primary', '#121213');
      document.documentElement.style.setProperty('--bg-secondary', '#2a2a2b');
      document.documentElement.style.setProperty('--bg-tertiary', '#3a3a3c');
      document.documentElement.style.setProperty('--text-primary', '#ffffff');
      document.documentElement.style.setProperty('--text-secondary', '#d3d6da');
      document.documentElement.style.setProperty('--text-muted', '#818384');
      document.documentElement.style.setProperty('--border-color', '#d3d6da');
      document.documentElement.style.setProperty('--border-light', '#565758');
      document.documentElement.style.setProperty('--correct-color', '#6aaa64');
      document.documentElement.style.setProperty('--present-color', '#f7b731');
      document.documentElement.style.setProperty('--absent-color', '#787c7e');
      document.documentElement.style.setProperty('--modal-content-bg', '#1a1a1b');
      document.documentElement.style.setProperty('--shadow', 'rgba(0, 0, 0, 0.3)');
      
      // Apply background directly to html and body elements
      document.documentElement.style.backgroundColor = '#121213';
      document.body.style.backgroundColor = '#121213';
    }
    
    // Force style recalculation by toggling a class
    document.body.classList.toggle('theme-changing', true);
    setTimeout(() => {
      document.body.classList.toggle('theme-changing', false);
    }, 10);
    
    console.log('Theme applied. Document classes:', document.documentElement.className);
    console.log('Document data-theme:', document.documentElement.getAttribute('data-theme'));
    console.log('CSS variables applied directly to document element');
  }
}
