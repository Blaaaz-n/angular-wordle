import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface GameResult {
  gameNumber: number;
  guesses: number;
  maxGuesses: number;
  won: boolean;
  word: string;
  guessResults: Array<{
    guess: string;
    results: Array<'correct' | 'present' | 'absent'>;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class ShareService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  generateShareText(result: GameResult): string {
    const header = `Wordle Clone ${result.gameNumber} ${result.guesses}/${result.maxGuesses}`;
    const status = result.won ? '🎉' : '😔';
    
    const emojiGrid = this.createEmojiGrid(result.guessResults);
    
    return `${header}\n${emojiGrid}\n\nPlay at: [Your Demo URL]`;
  }

  generateShareableImage(result: GameResult): string {
    // This would typically generate an image using Canvas API
    // For now, return the text representation
    return this.generateShareText(result);
  }

  private createEmojiGrid(guessResults: Array<{ guess: string; results: Array<'correct' | 'present' | 'absent'> }>): string {
    const emojiMap = {
      correct: '🟩',
      present: '🟨',
      absent: '⬜'
    };

    return guessResults
      .map(guess => guess.results.map(result => emojiMap[result]).join(''))
      .join('\n');
  }

  async copyToClipboard(text: string): Promise<boolean> {
    if (!isPlatformBrowser(this.platformId)) return false;
    
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const success = document.execCommand('copy');
        document.body.removeChild(textArea);
        return success;
      }
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  }

  shareNative(result: GameResult): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const shareData = {
      title: 'Wordle Clone Result',
      text: this.generateShareText(result),
      url: window.location.href
    };

    if (navigator.share && navigator.canShare(shareData)) {
      navigator.share(shareData).catch(error => {
        console.error('Error sharing:', error);
        this.fallbackShare(result);
      });
    } else {
      this.fallbackShare(result);
    }
  }

  private fallbackShare(result: GameResult): void {
    // Fallback to copying to clipboard
    this.copyToClipboard(this.generateShareText(result)).then(success => {
      if (success) {
        // You might want to show a toast notification here
        console.log('Result copied to clipboard!');
      }
    });
  }
}
