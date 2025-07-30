import { Component } from '@angular/core';
import { WordService } from '../services/word';

@Component({
  selector: 'app-game',
  imports: [],
  templateUrl: './game.html',
  styleUrls: ['./game.css']
})
export class Game {

  randomWord: string= '';

  constructor(private wordService: WordService) {
    this.wordService.getRandomWord().subscribe(word => {
      this.randomWord = word;
    });
  }
  validateWord(word: string): void {
    this.wordService.validateWord(word).subscribe(isValid => {
      if (isValid) {
        console.log(`${word} is a valid word.`);
      } else {
        console.log(`${word} is not a valid word.`);
      }
    });
  }

}
