import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WordService {
  private apiUrl = 'https://api.frontendexpert.io/api/fe/wordle-words'; 

  constructor(private http: HttpClient) {}

  getWordList(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl, { headers: {Accept: 'application/json'} });
  }
  getRandomWord(): Observable<string> {
    return this.getWordList().pipe(
      map(words => words[Math.floor(Math.random() * words.length)].toUpperCase())
    );
  }
}

  