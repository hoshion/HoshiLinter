import { StatementParser } from './statement-parser/statement-parser.js';
import { ScopeParser } from './scope-parser/scope-parser.js';
import { ExpressionParser } from './expression-parser/expression-parser.js';
import { Symbols } from '../symbols.js';
import {Keywords} from "../keywords.js";

export const STATEMENT_KEYWORD_LIST = [
  Keywords.IF, Keywords.FOR, Keywords.DO, Keywords.CLASS,
  Keywords.WHILE, Keywords.THROW, Keywords.SWITCH,
  Keywords.FUNCTION, Keywords.VAR, Keywords.LET, Keywords.CONST,
  Keywords.IMPORT, Keywords.EXPORT, Keywords.TRY,
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
      new StatementParser(this).parse(owner);
    } else if (this.currentToken.value === Symbols.OPENING_BRACE) {
      new ScopeParser(this).parse(owner);
    } else {
      new ExpressionParser(this).parse(owner);
    }
  }

  log() {
    console.dir(this.parts, { depth: null });
  }

  getPrevious() {
    return this.tokenizer.filteredTokens[this.currentTokenId - 1];
  }

  previous() {
    this.currentTokenId--;
    this.currentToken = this.tokenizer.filteredTokens[this.currentTokenId];
  }
}
