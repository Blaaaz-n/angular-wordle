import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WordService {
  // Note: External APIs blocked by CORS in development
  // Using local word list instead for reliability

  // Fallback word list using official Wordle words
  private fallbackWordList = [
    'ALBUM', 'HINGE', 'MONEY', 'SCRAP', 'GAMER', 'GLASS', 'SCOUR', 'BEING', 'DELVE', 'YIELD',
    'METAL', 'TIPSY', 'SLUNG', 'FARCE', 'GECKO', 'SHINE', 'CANNY', 'MIDST', 'BADGE', 'HOMER',
    'TRAIN', 'STORY', 'HAIRY', 'FORGO', 'LARVA', 'TRASH', 'ZESTY', 'SHOWN', 'HEIST', 'ASKEW',
    'INERT', 'OLIVE', 'PLANT', 'OXIDE', 'CARGO', 'FOYER', 'FLAIR', 'AMPLE', 'CHEEK', 'SHAME',
    'MINCE', 'CHUNK', 'ROYAL', 'SQUAD', 'BLACK', 'STAIR', 'SCARE', 'FORAY', 'COMMA', 'NATAL',
    'SHAWL', 'FEWER', 'TROPE', 'SNOUT', 'LOWLY', 'STOVE', 'SHALL', 'FOUND', 'NYMPH', 'EPOXY',
    'DEPOT', 'CHEST', 'PURGE', 'SLOSH', 'THEIR', 'RENEW', 'ALLOW', 'SAUTE', 'MOVIE', 'CATER',
    'TEASE', 'SMELT', 'FOCUS', 'TODAY', 'WATCH', 'LAPSE', 'MONTH', 'SWEET', 'HOARD', 'CLOTH',
    'BRINE', 'AHEAD', 'MOURN', 'NASTY', 'RUPEE', 'CHOKE', 'CHANT', 'SPILL', 'VIVID', 'BLOKE',
    'TROVE', 'THORN', 'OTHER', 'TACIT', 'SWILL', 'DODGE', 'SHAKE', 'CAULK', 'AROMA', 'CYNIC',
    'ROBIN', 'ULTRA', 'ULCER', 'PAUSE', 'HUMOR', 'FRAME', 'ELDER', 'SKILL', 'ALOFT', 'PLEAT',
    'SHARD', 'MOIST', 'THOSE', 'LIGHT', 'WRUNG', 'COULD', 'PERKY', 'MOUNT', 'WHACK', 'SUGAR',
    'KNOLL', 'CRIMP', 'WINCE', 'PRICK', 'ROBOT', 'POINT', 'PROXY', 'SHIRE', 'SOLAR', 'PANIC',
    'TANGY', 'ABBEY', 'FAVOR', 'DRINK', 'QUERY', 'GORGE', 'CRANK', 'SLUMP', 'BANAL', 'TIGER',
    'SIEGE', 'TRUSS', 'BOOST', 'REBUS', 'UNIFY', 'TROLL', 'TAPIR', 'ASIDE', 'FERRY', 'ACUTE',
    'PICKY', 'WEARY', 'GRIPE', 'CRAZE', 'PLUCK', 'BRAKE', 'BATON', 'CHAMP', 'PEACH', 'USING',
    'TRACE', 'VITAL', 'SONIC', 'MASSE', 'CONIC', 'VIRAL', 'RHINO', 'BREAK', 'TRIAD', 'EPOCH',
    'USHER', 'EXULT', 'GRIME', 'CHEAT', 'SOLVE', 'BRING', 'PROVE', 'STORE', 'TILDE', 'CLOCK',
    'WROTE', 'RETCH', 'PERCH', 'ROUGE', 'RADIO', 'SURER', 'FINER', 'VODKA', 'HERON', 'CHILL',
    'GAUDY', 'PITHY', 'SMART', 'BADLY', 'ROGUE', 'GROUP', 'FIXER', 'GROIN', 'DUCHY', 'COAST',
    'BLURT', 'PULPY', 'ALTAR', 'GREAT', 'BRIAR', 'CLICK', 'GOUGE', 'WORLD', 'ERODE', 'BOOZY',
    'DOZEN', 'FLING', 'GROWL', 'ABYSS', 'STEED', 'ENEMA', 'JAUNT', 'COMET', 'TWEED', 'PILOT',
    'DUTCH', 'BELCH', 'OUGHT', 'DOWRY', 'THUMB', 'HYPER', 'HATCH', 'ALONE', 'MOTOR', 'ABACK',
    'GUILD', 'KEBAB', 'SPEND', 'FJORD', 'ESSAY', 'SPRAY', 'SPICY', 'AGATE', 'SALAD', 'BASIC',
    'MOULT', 'CORNY', 'FORGE', 'CIVIC', 'ISLET', 'LABOR', 'GAMMA', 'LYING', 'AUDIT', 'ROUND',
    'LOOPY', 'LUSTY', 'GOLEM', 'GONER', 'GREET', 'START', 'LAPEL', 'BIOME', 'PARRY', 'SHRUB',
    'FRONT', 'WOOER', 'TOTEM', 'FLICK', 'DELTA', 'BLEED', 'ARGUE', 'SWIRL', 'ERROR', 'AGREE',
    'OFFAL', 'FLUME', 'CRASS', 'PANEL', 'STOUT', 'BRIBE', 'DRAIN', 'YEARN', 'PRINT', 'SEEDY',
    'IVORY', 'BELLY', 'STAND', 'FIRST', 'FORTH', 'BOOBY', 'FLESH', 'UNMET', 'LINEN', 'MAXIM',
    'POUND', 'MIMIC', 'SPIKE', 'CLUCK', 'CRATE', 'DIGIT', 'REPAY', 'SOWER', 'CRAZY', 'ADOBE',
    'OUTDO', 'TRAWL', 'WHELP', 'UNFED', 'PAPER', 'STAFF', 'CROAK', 'HELIX', 'FLOSS', 'PRIDE',
    'BATTY', 'REACT', 'MARRY', 'ABASE', 'COLON', 'STOOL', 'CRUST', 'FRESH', 'DEATH', 'MAJOR',
    'FEIGN', 'ABATE', 'BENCH', 'QUIET', 'GRADE', 'STINK', 'KARMA', 'MODEL', 'DWARF', 'HEATH',
    'SERVE', 'NAVAL', 'EVADE', 'FOCAL', 'BLUSH', 'AWAKE', 'HUMPH', 'SISSY', 'REBUT', 'CIGAR'
  ];

  constructor(private http: HttpClient) {}

  getWordList(): Observable<string[]> {
    // Use local word list directly to avoid CORS issues
    return of(this.fallbackWordList);
  }

  getRandomWord(): Observable<string> {
    const randomWord = this.fallbackWordList[Math.floor(Math.random() * this.fallbackWordList.length)];
    return of(randomWord);
  }

  validateWord(word: string): Observable<boolean> {
    // First check if it's a valid 5-letter word format
    if (!/^[A-Za-z]{5}$/.test(word) || word.length !== 5) {
      return of(false);
    }

    // Check if the word is in our fallback list (official Wordle words)
    const upperWord = word.toUpperCase();
    if (this.fallbackWordList.includes(upperWord)) {
      return of(true);
    }

    // Try to validate against dictionary API
    const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`;
    return this.http.get(apiUrl).pipe(
      map(() => true),
      catchError(() => of(false)) // Only accept words that exist in dictionary
    );
  }
}

  