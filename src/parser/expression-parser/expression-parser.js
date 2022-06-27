import { Expression } from './expression.js';
import { BRACKETS, BRACKETS_MAP, Utils } from '../../utils/utils.js';
import { StatementParser } from '../statement-parser/statement-parser.js';
import { ScopeParser } from '../scope-parser/scope-parser.js';
import { Symbols } from '../../enums/symbols.js';
import { Keywords } from '../../enums/keywords.js';
import { TokenTypes } from '../../enums/token-types.js';
import { StructureParser } from "../structure-parser.js";

export class ExpressionParser extends StructureParser{
  expression;
  bracketsCounter = 0;
  searchingArray;

  parse(owner) {
    const filteredArray = this.parser.getFromCurrentToEnd();
    this.searchingArray = Utils.joinTokens(
      filteredArray,
      this.parser.tokenizer.allTokens,
      TokenTypes.SEMICOLON
    );
    this.expression = new Expression();
    this.findExpression();
    owner.parts.push(this.expression);
  }

  findExpression() {
    for (let i = 0; i < this.searchingArray.length; i++) {
      if (this.checkToken()) break;
    }
  }

  checkToken() {
    if (this.checkStructure()) return true;

    this.expression.parts.push(this.parser.currentToken);

    if (
      this.isSemicolonNext() ||
      this.isOutsideBracket() ||
      this.isEndOfLine()
    ) {
      return true;
    }

    this.parser.next();
    return false;
  }

  isEndOfLine() {
    return this.checkEndOfLine(this.parser.getNext(), this.parser.currentToken);
  }

  isOutsideBracket() {
    return (
      !this.isScope(this.parser.currentToken, this.parser.getNext()) &&
      this.checkBracket(this.parser.getNext())
    );
  }

  isSemicolonNext() {
    const index = this.searchingArray.indexOf(this.parser.currentToken);
    const nextToken = this.searchingArray[index + 1];
    return nextToken && nextToken.value === Symbols.SEMICOLON;
  }

  checkStructure() {
    const token = this.parser.currentToken;

    if (token.is(Keywords.FUNCTION)) {
      return this.checkFunction();
    } else if (token.is(Symbols.OPENING_BRACE)) {
      return this.checkScope();
    } else if (token.is(Symbols.LAMBDA)) {
      return this.checkLambda();
    }

    return false;
  }

  checkLambda() {
    this.expression.parts.push(this.parser.currentToken);
    this.parser.next();
    return this.getScope();
  }

  checkScope() {
    const isScope = this.isScope(
      this.parser.getPrevious(),
      this.parser.currentToken
    );
    if (isScope) {
      return this.getScope();
    } else {
      return false;
    }
  }

  getScope() {
    new ScopeParser(this.parser).parse(this.expression);
    const next = this.parser.getNext();

    const isEmphasise = next.is(Symbols.CLOSING_PARENTHESIS);
    const isComma = next.is(Symbols.COMMA);

    if (isEmphasise || isComma) {
      this.parser.next();
      return false;
    }

    return true;
  }

  checkFunction() {
    new StatementParser(this.parser).parse(this.expression);
    return true;
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
      return !(
        token.isOperator() ||
        previous.isOperator() ||
        BRACKETS.includes(token.value) ||
        BRACKETS.includes(previous.value)
      );
    } else {
      return false;
    }
  }

  isScope(leftBracket, rightBracket) {
    return (
      leftBracket.value === Symbols.CLOSING_PARENTHESIS &&
      rightBracket.value === Symbols.OPENING_BRACE
    );
  }
}
