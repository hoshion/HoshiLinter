import { Utils } from '../../utils/utils.js';
import { STATEMENT_KEYWORD_LIST } from '../parser.js';
import { ExpressionParser } from '../expression-parser/expression-parser.js';
import { Scope } from './scope.js';
import { StatementParser } from '../statement-parser/statement-parser.js';
import { Symbols } from '../../symbols.js';

export class ScopeParser {
  static counter = 0;
  index;
  owner;
  parser;
  scope;

  constructor(owner, parser) {
    this.owner = owner;
    this.parser = parser;
    this.index = ScopeParser.counter++;
  }

  parse() {
    let searchingArray;
    this.scope = new Scope();
    const tokenizer = this.parser.tokenizer;
    const curToken = this.parser.currentToken;

    if (curToken.value === Symbols.OPENING_BRACE) {
      this.scope.parts.push(curToken);
      const closingBracket = Utils.findClosingBracket(curToken, tokenizer.filteredTokens);

      searchingArray = this.parser.getFromCurrentToExact(closingBracket).slice(1, -1);
      this.parser.next();
      this.parseArray(searchingArray);

      this.scope.parts.push(closingBracket);
    } else if (STATEMENT_KEYWORD_LIST.includes(curToken.value)) {
      new StatementParser(this.scope, this.parser, curToken).parse();
    } else {
      new ExpressionParser(this.scope, this.parser).parse();
    }

    this.owner.parts.push(this.scope);
  }

  parseArray(array) {
    for (let i = 0; i < array.length; i++) {
      this.parser.parseToken(this.scope);
      i = array.indexOf(this.parser.currentToken);
      this.parser.next();
    }
  }
}
