import { Expression } from './expression.js';
import { brackets, bracketsMap, Utils } from './utils.js';
import { StatementParser } from './statement-parser.js';
import { ScopeParser } from './scope-parser.js';

export class ExpressionParser {
  static counter = 0;
  index;
  owner;
  parser;
  startingToken;
  bracketsCounter = 0;

  constructor(owner, parser) {
    this.owner = owner;
    this.parser = parser;
    this.startingToken = this.parser.currentToken;
    this.index = ExpressionParser.counter++;
  }

  parse() {
    const tokenizer = this.parser.tokenizer;
    const searchingArray = Utils.joinTokens(this.parser.getFromCurrentToEnd(), tokenizer.allTokens, 'semicolon');
    this.owner.parts.push(this.findExpression(searchingArray));
  }

  findExpression(tokens) {
    const expression = new Expression();
    let previousToken = tokens[0];
    label:
    for (let i = 0; i < tokens.length; i++) {
      let token = tokens[i];

      switch (token.value) {
      case 'function':
        new StatementParser(expression, this.parser, 'function').parse();
        break label;
      case '{':
        if (this.isScope(previousToken, token)) new ScopeParser(expression, this.parser).parse();
        else expression.parts.push(token);
        break label;
      case '=>':
        this.parser.next();
        new ScopeParser(expression, this.parser).parse();
        expression.parts.push(token);
        break label;
      default:
        expression.parts.push(token);
      }

      const nextToken = tokens[i + 1] === undefined ? this.parser.getNext() : tokens[i + 1];

      if (nextToken.type === 'semicolon') break;
      if (!this.isScope(token, nextToken) && this.checkBracket(nextToken)) break;
      if (this.checkEndOfLine(nextToken, token)) break;

      this.parser.next();
      previousToken = token;
    }
    return expression;
  }

  checkBracket(token) {
    if (brackets.includes(token.value)) {
      if (bracketsMap.has(token.value)) this.bracketsCounter++;
      else this.bracketsCounter--;
    }
    return this.bracketsCounter < 0;
  }

  checkEndOfLine(token, previous) {
    if (token.row !== previous.row) {
      return !(token.type.endsWith('operator') || previous.type.endsWith('operator') ||
        brackets.includes(token.value) || brackets.includes(previous.value));
    } else { return false; }
  }

  isScope(leftBracket, rightBracket) {
    return leftBracket.value === ")" && rightBracket.value === "{";
  }
}