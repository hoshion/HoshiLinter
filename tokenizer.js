import {Token} from "./token.js";

const keywords = [
  "await", "break", "case", "catch", "class", "const", "continue", "debugger", "default", "delete",
  "do", "else", "enum", "export", "extends", "false", "finally", "for", "function", "if", "implements", "import",
  "in", "instanceof", "interface", "let", "new", "null", "package", "private", "protected", "public", "return",
  "super", "switch", "static", "this", "throw", "try", "true", "typeof", "var", "void", "while", "with", "yield"
];
const filteredTypes = [
  "end-of-line", "whitespace", "semicolon", "undefined"
];

export class Tokenizer {
  text;
  currentRow = 1;
  currentCol = 1;
  currentSymbolIndex = 0;
  currentSymbol;
  filteredTokens = [];
  allTokens = [];
  isEndOfLine = false;

  constructor(text) {
    this.text = text;
  }

  tokenize(){
    this.currentSymbol = this.text[this.currentSymbolIndex];
    while (this.currentSymbol !== null && this.currentSymbol !== undefined) {
      const token = this.createToken();
      this.allTokens.push(token);
      if (!filteredTypes.includes(token.type)) this.filteredTokens.push(token);
      this.next();
    }
  }

  updateRowAndCol(amount = 1) {
    if (this.isEndOfLine) {
      this.currentRow++;
      this.currentCol = 1;
      this.isEndOfLine = false;
    } else {
      this.currentCol += amount;
    }
  }

  createToken() {
    let futureToken = new Token(this.currentRow, this.currentCol);
    if (this.currentSymbol.matches(/[0-9]/)) this.createNumberToken(futureToken);
    if (this.currentSymbol === "\n") this.createEndOfLineToken(futureToken);
    if (this.currentSymbol.matches(/[a-zA-Z_$]/)) this.createWordToken(futureToken);
    if (this.currentSymbol.matches(/["'`]/)) this.createStringToken(futureToken);
    if (this.currentSymbol.matches(/[{}\[\]()]/)) this.createBracketsToken(futureToken);
    if (this.currentSymbol.matches(/[><!]/g)) this.createComparingToken(futureToken);
    if (this.currentSymbol === ";") this.createSemicolonToken(futureToken);
    if (this.currentSymbol === ".") this.createDotToken(futureToken);
    if (this.currentSymbol === ",") this.createCommaToken(futureToken);
    if (this.currentSymbol === " ") this.createWhitespaceToken(futureToken);
    if (this.currentSymbol === "=") this.createAssignmentOrLogicalToken(futureToken);

    return futureToken;
  }

  createEndOfLineToken(token) {
    this.isEndOfLine = true;
    token.type = "end-of-line";
    token.value = this.currentSymbol;
  }

  createNumberToken(token) {
    token.type = "number";
    token.value = this.getWholeWord();
  }

  createWordToken(token) {
    token.value = this.getWholeWord();

    if (keywords.includes(token.value)) token.type = "keyword";
    else token.type = "identifier";
  }

  getWholeWord() {
    let word = this.currentSymbol;
    while (this.nextSymbol().matches(/[a-zA-Z0-9_$]/g)) {
      word += this.next();
    }
    return word;
  }

  createEndOfFileToken(token) {

  }

  createStringToken(token) {
    token.type = "string";
    let tex = this.text.slice(this.currentSymbolIndex);

    if (this.currentSymbol === '"') {
      if (tex.matches(/.*(?<!\\)".*/s)) {
        token.value = '"' + (tex.split(/(?<!\\)"/)[1]) + '"';
      }
    }
    if (this.currentSymbol === "'") {
      if (tex.matches(/.*(?<!\\)'.*/s)) {
        token.value = "'" + (tex.split(/(?<!\\)'/)[1]) + "'";
      }
    }
    if (this.currentSymbol === "`") {
      if (tex.matches(/.*(?<!\\)`.*/s)) {
        token.value = "`" + (tex.split(/(?<!\\)`/)[1]) + "`";
      }
    }

    this.next(token.value.length - 1);
  }

  createBracketsToken(token) {
    token.value = this.currentSymbol;

    if (token.value.matches(/[({\[]/)) token.type = "opening";
    else token.type = "closing";
    if (token.value.matches(/[\[\]]/)) token.type += "-bracket";
    else if (token.value.matches(/[()]/)) token.type += "-parenthesis";
    else token.type += "-brace";
  }

  createSemicolonToken(token) {
    token.type = "semicolon";
    token.value = ";";
  }

  createWhitespaceToken(token) {
    token.type = "whitespace";
    token.value = " ";
    while (this.nextSymbol() === " ") {
      token.value += this.next();
    }
  }

  createAssignmentOrLogicalToken(token) {
    if (this.nextSymbol() === "=") {
      token.type = "comparing-operator";
      token.value = "==";
      if (this.nextSymbol(2) === "="){
        token.value += "=";
        this.next();
      }
      this.next();
    } else {
      token.type = "assignment";
      token.value = "=";
    }
  }

  createComparingToken(token) {
    token.type = "comparing-operator";
    token.value = this.currentSymbol;
    if (this.nextSymbol() === "="){
      token.value += "=";
    }
    if (this.nextSymbol(2) === "=") {
      token.value += "=";
    }
  }

  createDotToken(token) {
    token.type = "dot";
    token.value = ".";
  }

  createCommaToken(token) {
    token.type = "comma";
    token.type = ",";
  }

  next(amount = 1) {
    this.currentSymbolIndex += amount;
    this.currentSymbol = this.text[this.currentSymbolIndex];
    this.updateRowAndCol(amount);
    return this.currentSymbol;
  }

  nextSymbol(amount = 1) {
    return this.text[this.currentSymbolIndex + amount];
  }

  log(fullLog = false){
    if (fullLog) console.table(this.allTokens);
    else console.table(this.filteredTokens);
  }
}
