import { Token } from './token.js';
import { Symbols } from '../enums/symbols.js';
import { TokenTypes } from '../enums/token-types.js';
import { TOKEN_TYPES } from './token-regex.js';

const FILTERED_TYPES = [
  TokenTypes.END_OF_LINE,
  TokenTypes.WHITESPACE,
  TokenTypes.SEMICOLON,
  TokenTypes.UNDEFINED
];

export class Tokenizer {
  text;
  checkingText;
  currentRow = 1;
  currentCol = 1;
  currentToken;
  filteredTokens = [];
  allTokens = [];

  constructor(text) {
    this.text = text;
    this.checkingText = text;
  }

  tokenize() {
    while (this.checkingText !== Symbols.NOTHING) {
      this.createToken();
      this.allTokens.push(this.currentToken);

      this.addToFiltered(this.currentToken);
      this.next(this.currentToken.value.length);
    }
  }

  addToFiltered(token) {
    if (!FILTERED_TYPES.includes(token.type)) {
      this.filteredTokens.push(token);
    }
  }

  updateRowAndCol(amount = 1) {
    const token = this.currentToken;
    if (token.isType(TokenTypes.END_OF_LINE)) {
      this.currentRow++;
      this.currentCol = 1;
    } else if (token.isType(TokenTypes.MULTILINE_COMMENT)) {
      this.currentRow +=
        this.currentToken.value.split(Symbols.NEW_LINE).length - 1;
      this.currentCol = 1;
    } else {
      this.currentCol += amount;
    }
  }

  createToken() {
    this.currentToken = new Token(this.currentRow, this.currentCol);

    for (const [type, reg] of TOKEN_TYPES) {
      const res = this.createTypeToken(type, reg);
      if (res) break;
    }
  }

  createTypeToken(type, reg) {
    if (!this.checkingText.match(reg)) return false;

    this.currentToken.type = type;
    this.currentToken.value = this.checkingText.match(reg)[0];
    this.currentToken.length = this.currentToken.value.length;
    return true;
  }

  next(amount = 1) {
    this.updateRowAndCol(amount);
    this.checkingText = this.checkingText.slice(amount);
  }

  log(fullLog = false) {
    if (fullLog) console.table(this.allTokens);
    else console.table(this.filteredTokens);
  }
}
