import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WordService {
  private apiUrlWordle = 'https://api.frontendexpert.io/api/fe/wordle-words'; 
  private apiUrlDictionary = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

  constructor(private http: HttpClient) {}

  getWordList(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrlWordle , { headers: {Accept: 'application/json'} });
  }
  getRandomWord(): Observable<string> {
    return this.getWordList().pipe(
      map(words => words[Math.floor(Math.random() * words.length)].toUpperCase())
    );
  }
  validateWord(word: string): Observable<boolean> {
    return this.http.get<any[]>(`${this.apiUrlDictionary}${word}`).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }
}

  