import { Token } from "./token.js";
import { Symbols } from "../enums/symbols.js";
import { TokenTypes } from "../enums/token-types.js";
import { Operators } from "../enums/operators.js";

/* eslint-disable */
const keywordRegex =
  /^(await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|false|finally|for|function|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|super|switch|static|this|throw|try|true|typeof|var|void|while|with|yield)(?![A-Za-z0-9$_])/;
const filteredTypes = [
  TokenTypes.END_OF_LINE,
  TokenTypes.WHITESPACE,
  TokenTypes.SEMICOLON,
  TokenTypes.UNDEFINED,
];

const TOKEN_TYPES = new Map([
  [TokenTypes.COMMENT, /^\/\/.+/],
  [TokenTypes.MULTILINE_COMMENT, /^\/\*.*?\*\//s],
  [TokenTypes.SEMICOLON, /^;/],
  [TokenTypes.WHITESPACE, /^ +/],
  [TokenTypes.END_OF_LINE, /^(\r\n|\n)/],
  [TokenTypes.REGEX, /^\/.*?(?<!\\)\/[dgimsuy]*/s],

  [Operators.ARITHMETIC, /^(\+\+|--|\*\*(?!=)|[+\-\/*%](?![=\-+*]))/],
  [Operators.LOGICAL, /^(\|\||&&|!)(?!=)/],
  [Operators.DOT, /^\./],
  [Operators.COMMA, /^,/],
  [
    Operators.ASSIGNMENT,
    /^(=(?![=>])|(\+|-|\*|\/|%|\*\*|\?\?|\|\||&&|&|\||\^|<<|>>|>>>)=)/,
  ],
  [Operators.COMPARING, /^([><](?![=><])|==(?!=)|<=|>=|===|!=(?!=)|!==)/],
  [Operators.NULLISH, /^\?\?(?!=)/],
  [Operators.QUESTION_MARK, /^\?/],
  [Operators.COLON, /^:/],
  [Operators.BITWISE, /^(&(?!&)|\|(?!\|)|\^|<<|>>|>>>|~)(?!=)/],
  [Operators.ARROW, /^=>/],

  [TokenTypes.OPENING_BRACE, /^{/],
  [TokenTypes.CLOSING_BRACE, /^}/],
  [TokenTypes.OPENING_BRACKET, /^\[/],
  [TokenTypes.CLOSING_BRACKET, /^]/],
  [TokenTypes.OPENING_PARENTHESIS, /^\(/],
  [TokenTypes.CLOSING_PARENTHESIS, /^\)/],

  [TokenTypes.STRING, /^('.*?(?<!\\)'|".*?(?<!\\)"|`.*?(?<!\\)`)/s],
  [TokenTypes.NUMBER, /^\d+/],
  [TokenTypes.KEYWORD, keywordRegex],
  [TokenTypes.IDENTIFIER, /^[a-zA-Z_$][a-zA-Z_$0-9]*/],
]);

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
      this.currentToken.index = this.allTokens.length + 1;
      this.allTokens.push(this.currentToken);
      if (!filteredTypes.includes(this.currentToken.type))
        this.filteredTokens.push(this.currentToken);
      this.next(this.currentToken.value.length);
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
