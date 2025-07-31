import { Component, OnInit, OnDestroy } from '@angular/core';
import { WordService } from '../services/word';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
  guesses: string[][] = Array.from({ length: this.rows }, () => Array(this.wordLength).fill(''));
  statuses: ('correct' | 'present' | 'absent' | '')[][] = Array.from({ length: this.rows }, () => Array(this.wordLength).fill(''));

  constructor(private wordService: WordService) {
    this.wordService.getRandomWord()
      .subscribe(w => {
        this.randomWord = w.toUpperCase();
      });
  }

  ngOnInit(): void {
    window.addEventListener('keydown', this.keyListener);
  }

  ngOnDestroy(): void {
    window.removeEventListener('keydown', this.keyListener);
  }

  keyListener = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && this.currentRow < this.rows && !this.gameWon) {
      this.checkWordExists();
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

    setTimeout(() => {
      if (col < this.wordLength - 1) {
        const allInputs = document.querySelectorAll('.letter-cell') as NodeListOf<HTMLInputElement>;
        const currentIndex = row * this.wordLength + col;
        const nextInput = allInputs[currentIndex + 1];
        nextInput?.focus();
      }
    }, 0);
  }

  onKeyDown(event: KeyboardEvent, row: number, col: number): void {
    if (this.gameWon) {
      event.preventDefault();
      return;
    }

    if (event.key === 'Backspace') {
      this.guesses[row][col] = '';

      const allInputs = document.querySelectorAll('.letter-cell') as NodeListOf<HTMLInputElement>;
      const currentIndex = row * this.wordLength + col;
      const prevInput = allInputs[currentIndex - 1];
      prevInput?.focus();

      event.preventDefault();
    }
  }

  checkWordExists() {
    const guess = this.guesses[this.currentRow].join('');
    if (guess.length !== this.wordLength) {
      alert(`Please enter a ${this.wordLength}-letter word.`);
      return;
    }

    this.wordService.validateWord(guess.toLowerCase()).subscribe(valid => {
      if (!valid) {
        alert(`"${guess}" is not a valid word.`);
      } else {
        this.checkIfCorrect(guess);
      }
    });
  }

  checkIfCorrect(guess: string) {
    const target = this.randomWord;
    for (let i = 0; i < this.wordLength; i++) {
      const c = guess[i];
      this.statuses[this.currentRow][i] =
        c === target[i] ? 'correct'
      : target.includes(c) ? 'present'
      : 'absent';
    }

    if (guess === target) {
      alert(`🎉 Correct! The word was ${target}`);
      this.gameWon = true;
    } else {
      this.currentRow = Math.min(this.currentRow + 1, this.rows - 1);
      if (this.currentRow === this.rows - 1) {
        alert(`❌ Game over! The word was ${target}`);
      }
    }
  }
}
