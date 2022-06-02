import {Token} from "./token.js";

const keywordRegex = /^(await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|false|finally|for|function|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|super|switch|static|this|throw|try|true|typeof|var|void|while|with|yield)/
const filteredTypes = [
  "end-of-line", "whitespace", "semicolon", "undefined"
];

const tokenTypes = new Map([
  ["comment", /^\/\/.+/],
  ["multiline-comment", /^\/\*.*?\*\//s],
  ["regex-operator", /^\/.*?(?<!\\)\/[dgimsuy]*/s],
  ["arithmetic-operator", /^(\+\+|--|\*\*(?!=)|[+\-\/*%](?![=\-+*]))/],
  ["logical-operator", /^(\|\||&&|!)(?!=)/],
  ["dot-operator", /^\./],
  ["comma-operator", /^,/],
  ["semicolon", /^;/],
  ["whitespace", /^ +/],
  ["assignment-operator", /^(=(?![=>])|(\+|-|\*|\/|%|\*\*|\?\?|\|\||&&|&|\||\^|<<|>>|>>>)=)/],
  ["logical-operator", /^(\|\||&&|!)(?!=)/],
  ["comparing-operator", /^((?<!=)[<>](?![=<>])|<=|>=|===|!=|!==)/],
  ["nullish-operator", /^\?\?(?!=)/],
  ["opening-brace", /^{/],
  ["closing-brace", /^}/],
  ["opening-bracket", /^\[/],
  ["closing-bracket", /^]/],
  ["question-mark", /^\?/],
  ["colon", /^:/],
  ["bitwise-operator", /^(&(?!&)|\|(?!\|)|\^|<<|>>|>>>|~)(?!=)/],
  ["opening-parenthesis", /^\(/],
  ["closing-parenthesis", /^\)/],
  ["arrow-operator", /^=>/],
  ["string", /^('.*?(?<!\\)'|".*?(?<!\\)"|`.*?(?<!\\)`)/s],
  ["end-of-line", /^(\r\n|\n)/],
  ["number", /^\d+/],
  ["keyword", keywordRegex],
  ["variable", /^[a-zA-Z_$][a-zA-Z_$0-9]*/]
])

export class Tokenizer {
  text;
  checkingText;
  currentRow = 1;
  currentCol = 1;
  currentSymbolIndex = 0;
  currentSymbol;
  currentToken;
  filteredTokens = [];
  allTokens = [];

  constructor(text) {
    this.text = text;
    this.checkingText = text;
  }

  tokenize(){
    this.currentSymbol = this.text[this.currentSymbolIndex];
    while (this.currentSymbol !== null && this.currentSymbol !== undefined) {
      this.createToken();
      this.allTokens.push(this.currentToken);
      if (!filteredTypes.includes(this.currentToken.type)) this.filteredTokens.push(this.currentToken);
      this.next(this.currentToken.value.length);
    }
  }

  updateRowAndCol(amount = 1) {
    switch (this.currentToken.type) {
      case "end-of-line": {
        this.currentRow++;
        this.currentCol = 1;
        break;
      }
      case "multiline-comment": {
        this.currentRow += this.currentToken.value.split("\n").length - 1
        this.currentCol = 1;
        break;
      }
      default:
        this.currentCol += amount;
    }
  }

  createToken() {
    this.currentToken = new Token(this.currentRow, this.currentCol);

    for (const [type, reg] of tokenTypes) {
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
    this.currentSymbolIndex += amount;
    this.currentSymbol = this.text[this.currentSymbolIndex];
    this.updateRowAndCol(amount);
    this.checkingText = this.checkingText.slice(amount);
    return this.currentSymbol;
  }

  log(fullLog = false) {
    if (fullLog) console.table(this.allTokens);
    else console.table(this.filteredTokens);
  }
}
