import { Component, ViewChildren, ElementRef, QueryList } from '@angular/core';
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
export class Game {

  randomWord = '';
  currentRow = 0;
  gameWon = false;

  guesses: string[][] = Array.from({ length: 6 }, () => Array(5).fill(''));
  statuses: ('correct' | 'present' | 'absent' | '')[][] = Array.from({ length: 6 }, () => Array(5).fill(''));

  constructor(private wordService: WordService) {
    this.wordService.getRandomWord()
      .subscribe(w => this.randomWord = w.toUpperCase());
  }

  onInput(event: Event, row: number, col: number): void {
  const input = event.target as HTMLInputElement;
  let char = input.value.toUpperCase();

  if (!/^[A-Z]$/.test(char)) {
    input.value = '';
    return;
  }

  input.value = ''; // Clear it before moving to the next

  this.guesses[row][col] = char;

  setTimeout(() => {
    if (col < 4) {
      const allInputs = document.querySelectorAll('.letter-cell') as NodeListOf<HTMLInputElement>;
      const currentIndex = row * 5 + col;
      const nextInput = allInputs[currentIndex + 1];
      nextInput?.focus();
    }
  }, 0);

  // Optional: log values for debugging
  const allInputs = document.querySelectorAll('.letter-cell');
  console.log([...allInputs].map(i => (i as HTMLInputElement).value));
}




  onKeyDown(event: KeyboardEvent, row: number, col: number): void {
  if (this.gameWon) {
    event.preventDefault();
    return;
  }

  if (event.key === 'Backspace') {
    this.guesses[row][col] = '';

    const allInputs = document.querySelectorAll('.letter-cell') as NodeListOf<HTMLInputElement>;
    const currentIndex = row * 5 + col;
    const prevInput = allInputs[currentIndex - 1];
    prevInput?.focus();

    event.preventDefault();
  }
}


  checkWordExists() {
    const guess = this.guesses[this.currentRow].join('');
    if (guess.length !== 5) {
      alert('Please enter a 5-letter word.');
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
    for (let i = 0; i < 5; i++) {
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
      alert('❌ Try again.');
      this.currentRow = Math.min(this.currentRow + 1, 5);
    }
  }
}
