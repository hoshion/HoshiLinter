import { Expression } from './expression.js';
import { BRACKETS, BRACKETS_MAP, Utils } from '../../utils/utils.js';
import { StatementParser } from '../statement-parser/statement-parser.js';
import { ScopeParser } from '../scope-parser/scope-parser.js';
import { Symbols } from '../../symbols.js';

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
      case Symbols.OPENING_BRACE:
        if (this.isScope(previousToken, token)) new ScopeParser(expression, this.parser).parse();
        else expression.parts.push(token);
        console.log(this.parser.currentToken);
        break label;
      case Symbols.LAMBDA:
        this.parser.next();
        expression.parts.push(token);
        new ScopeParser(expression, this.parser).parse();
        this.parser.next();
        if (this.parser.currentToken.value === Symbols.CLOSING_EMPHASISE) {
          expression.parts.push(this.parser.currentToken);
        } else if (this.parser.currentToken.value === Symbols.COMMA) {
          break;
        }
        break label;
      }
      i = tokens.indexOf(this.parser.currentToken);
      token = tokens[i];

      expression.parts.push(token);

      const nextToken = tokens[i + 1] === undefined ? this.parser.getNext() : tokens[i + 1];
      if (!nextToken) break;

      if (nextToken.value === Symbols.SEMICOLON) break;
      if (!this.isScope(token, nextToken) && this.checkBracket(nextToken)) break;
      if (this.checkEndOfLine(nextToken, token)) break;

      this.parser.next();
      previousToken = token;
    }
    return expression;
  }

  checkBracket(token) {
    if (BRACKETS.includes(token.value)) {
      if (BRACKETS_MAP.has(token.value)) this.bracketsCounter++;
      else this.bracketsCounter--;
    }
    return this.bracketsCounter < 0;
  }

  checkEndOfLine(token, previous) {
    if (token.row !== previous.row) {
      return !(token.type.endsWith('operator') || previous.type.endsWith('operator') ||
        BRACKETS.includes(token.value) || BRACKETS.includes(previous.value));
    } else { return false; }
  }

  isScope(leftBracket, rightBracket) {
    return leftBracket.value === Symbols.CLOSING_EMPHASISE && rightBracket.value === Symbols.OPENING_BRACE;
  }
}
