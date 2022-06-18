import { StatementParser } from './statement-parser/statement-parser.js';
import { ScopeParser } from './scope-parser/scope-parser.js';
import { ExpressionParser } from './expression-parser/expression-parser.js';
import { Symbols } from '../symbols';

export const STATEMENT_KEYWORD_LIST = [
  'if', 'for', 'do', 'class', 'while', 'throw',
  'switch', 'function', 'var', 'let', 'const',
  'import', 'export', 'try'
];

export class Parser {
  tokenizer;
  currentTokenId;
  currentToken;
  parts = [];

  constructor(tokenizer) {
    this.tokenizer = tokenizer;
    this.currentTokenId = 0;
  }

  parse() {
    this.currentToken = this.tokenizer.filteredTokens[this.currentTokenId];
    while (this.tokenizer.filteredTokens[this.currentTokenId]) {
      this.parseToken(this);
      this.next();
    }
  }

  getNext() {
    return this.tokenizer.filteredTokens[this.currentTokenId + 1];
  }

  next() {
    this.currentTokenId++;
    this.currentToken = this.tokenizer.filteredTokens[this.currentTokenId];
  }

  getFromCurrentToEnd() {
    const filteredTokens = this.tokenizer.filteredTokens;
    return filteredTokens.slice(filteredTokens.indexOf(this.currentToken));
  }

  getFromCurrentToExact(token) {
    const filteredTokens = this.tokenizer.filteredTokens;
    return filteredTokens.slice(filteredTokens.indexOf(this.currentToken), filteredTokens.indexOf(token) + 1);
  }

  parseToken(owner) {
    if (STATEMENT_KEYWORD_LIST.includes(this.currentToken.value)) {
      new StatementParser(owner, this, this.currentToken).parse();
    } else if (this.currentToken.value === Symbols.OPENING_BRACE) {
      new ScopeParser(owner, this).parse();
    } else {
      new ExpressionParser(owner, this).parse();
    }
  }

  log() {
    console.dir(this.parts, { depth: null });
  }

  previous() {
    this.currentTokenId--;
    this.currentToken = this.tokenizer.filteredTokens[this.currentTokenId];
  }
}
