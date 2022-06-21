import { Statement } from './statement.js';
import { ExpressionParser } from '../expression-parser/expression-parser.js';
import { ScopeParser } from '../scope-parser/scope-parser.js';
import { STATEMENT_KEYWORD_LIST } from '../parser.js';
import { Symbols } from '../../symbols.js';
import {Structures} from "../../structures.js";
import {Keywords} from "../../keywords.js";
import {TokenTypes} from "../../token-types.js";

const STATEMENTS_STRUCTURES = new Map([
  [Keywords.IF, [Symbols.OPENING_PARENTHESIS, Structures.EXPRESSION, Symbols.CLOSING_PARENTHESIS, Structures.SCOPE, [Symbols.QUESTION_MARK, Keywords.ELSE, Structures.SCOPE]]],
  [Keywords.FOR, [Symbols.OPENING_PARENTHESIS, Structures.EXPRESSION, [Symbols.QUESTION_MARK, Structures.EXPRESSION, Structures.EXPRESSION], Symbols.CLOSING_PARENTHESIS, Structures.SCOPE]],
  [Keywords.FUNCTION, [TokenTypes.IDENTIFIER, Symbols.OPENING_PARENTHESIS, Structures.EXPRESSION, Symbols.CLOSING_PARENTHESIS, Structures.SCOPE]],
  [Keywords.DO, [Structures.SCOPE, Keywords.WHILE, Symbols.OPENING_PARENTHESIS, Structures.EXPRESSION, Symbols.CLOSING_PARENTHESIS]],
  [Keywords.WHILE, [Symbols.OPENING_PARENTHESIS, Structures.EXPRESSION, Symbols.CLOSING_PARENTHESIS, Structures.SCOPE]],
  [Keywords.THROW, [Structures.EXPRESSION]],
  [Keywords.CLASS, [TokenTypes.IDENTIFIER, Structures.SCOPE]],
  [Keywords.SWITCH, [Symbols.OPENING_PARENTHESIS, Structures.EXPRESSION, Symbols.CLOSING_PARENTHESIS, Structures.SCOPE]],
  [Keywords.LET, [Structures.EXPRESSION]],
  [Keywords.CONST, [Structures.EXPRESSION]],
  [Keywords.VAR, [Structures.EXPRESSION]],
  [Keywords.IMPORT, [Structures.SCOPE, Keywords.FROM, TokenTypes.IDENTIFIER]],
  [Keywords.EXPORT, [[Symbols.QUESTION_MARK, Keywords.DEFAULT], Structures.SCOPE]],
  [Keywords.TRY, [Structures.SCOPE, [Symbols.QUESTION_MARK, Keywords.CATCH, Symbols.OPENING_PARENTHESIS, Structures.EXPRESSION, Symbols.CLOSING_PARENTHESIS, Structures.SCOPE], [Symbols.QUESTION_MARK, Keywords.FINALLY, Structures.SCOPE]]]
]);

export class StatementParser {
  parser;
  keywordToken;
  structure;
  statement;

  constructor(parser) {
    this.parser = parser;
    this.keywordToken = this.parser.currentToken;
    this.structure = STATEMENTS_STRUCTURES.get(this.keywordToken.value);
  }

  parse(owner) {
    this.statement = new Statement(this.keywordToken.value);
    this.statement.parts.push(this.keywordToken);

    this.parser.next();
    this.checkStructure(this.structure);
    owner.parts.push(this.statement);
  }

  checkRule(ruleArray) {

    const rule = ruleArray.shift();
    const curValue = this.parser.currentToken.value;
    if (rule === Symbols.QUESTION_MARK) {
      if (curValue === ruleArray[0]) {
        this.checkStructure(ruleArray);
        this.parser.next();
      } else if (ruleArray[0] === Structures.EXPRESSION) {
        if (
          STATEMENT_KEYWORD_LIST.includes(curValue) ||
          curValue === Symbols.OPENING_BRACE ||
          curValue === Symbols.CLOSING_PARENTHESIS
        ) return;
        this.checkStructure(ruleArray);
        this.parser.next();
      }
    }
  }

  checkStructure(structure) {
    for (const element of structure) {
      if (element instanceof Array) {
        this.checkRule(Array.from(element));
        continue;
      }

      this.checkElement(element);
      this.parser.next();
    }
    this.parser.previous();
  }

  checkElement(element) {
    const value = this.parser.currentToken.value;

    if (element === Structures.EXPRESSION) {
      new ExpressionParser(this.parser).parse(this.statement);
    } else if (element === Structures.SCOPE) {
      new ScopeParser(this.parser).parse(this.statement);
    } else if (element === value || element === TokenTypes.IDENTIFIER) {
      this.statement.parts.push(this.parser.currentToken);
    }
  }
}
