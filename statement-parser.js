import { Statement } from './statement.js';
import { ExpressionParser } from './expression-parser.js';
import { bracketsMap, Utils } from './utils.js';
import { ScopeParser } from './scope-parser.js';
import {statementKeywordsList} from "./parser.js";

const statementStructures = new Map([
  ['if', ['(', 'expression', ')', 'scope', ['?', 'else', 'scope']]],
  ['for', ['(', 'expression', ['?', 'expression', 'expression'], ')', 'scope']],
  ['function', ['identifier', '(', 'expression', ')', 'scope']],
  ['do', ['scope', 'while', '(', 'expression', ')']],
  ['while', ['(', 'expression', ')', 'scope']],
  ['throw', ['expression']],
  ['class', ['identifier', 'scope']],
  ['switch', ['(', 'expression', ')', 'scope']],
  ['let', ['expression']],
  ['const', ['expression']],
  ['var', ['expression']],
  ['import', ['scope', 'from', 'identifier']],
  ['export', [['?', 'default'], 'scope']],
  ['try', ['scope', ['?', 'catch', '(', 'expression', ')', 'scope'], ['?', 'finally', 'scope']]]
]);

export class StatementParser {
  owner;
  parser;
  keywordToken;
  structure;
  statement;
  possibleBorder;

  constructor(owner, parser, keywordToken) {
    this.owner = owner;
    this.parser = parser;
    this.keywordToken = keywordToken;
    this.structure = statementStructures.get(keywordToken.value);
  }

  parse() {
    this.statement = new Statement(this.keywordToken.value);
    this.statement.parts.push(this.keywordToken);

    this.parser.next();
    this.checkStructure(this.structure);
    this.owner.parts.push(this.statement);
  }

  checkRule(ruleArray) {
    const rule = ruleArray.shift();
    const curValue = this.parser.currentToken.value;
    switch (rule) {
    case '?':
      if (curValue === ruleArray[0]) {
        this.checkStructure(ruleArray);
      } else if (ruleArray[0] === 'expression') {
        if (statementKeywordsList.includes(curValue) || curValue === '{' || curValue === ')') return;
        this.checkStructure(ruleArray);
      }
    }
  }

  checkStructure(structure) {
    for (const element of structure) {
      if (element instanceof Array) {
        this.checkRule(element);
        continue;
      }

      this.checkElement(element);
      this.parser.next();
    }
    this.parser.previous();
  }

  checkElement(element) {
    switch (element) {
    case 'expression': new ExpressionParser(this.statement, this.parser).parse(); break;
    case 'scope': new ScopeParser(this.statement, this.parser).parse(); break;
    case 'token': this.statement.parts.push(this.parser.currentToken); break;
    default: {
      const value = this.parser.currentToken.value;
      if (element === value || element === 'identifier') this.statement.parts.push(this.parser.currentToken);
    }
    }

    this.setClosingBracket(element);
  }

  setClosingBracket(element) {
    if (bracketsMap.has(element)) {
      this.possibleBorder = Utils.findClosingBracket(this.parser.currentToken, this.parser.tokenizer.filteredTokens);
    }
  }
}
