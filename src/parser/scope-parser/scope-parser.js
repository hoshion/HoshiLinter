import { Utils } from "../../utils/utils.js";
import { STATEMENT_KEYWORD_LIST } from "../parser.js";
import { ExpressionParser } from "../expression-parser/expression-parser.js";
import { Scope } from "./scope.js";
import { StatementParser } from "../statement-parser/statement-parser.js";
import { Symbols } from "../../enums/symbols.js";

export class ScopeParser {
  parser;
  scope;

  constructor(parser) {
    this.parser = parser;
  }

  parse(owner) {
    this.scope = new Scope();
    const curToken = this.parser.currentToken;

    if (curToken.value === Symbols.OPENING_BRACE) {
      this.checkInsideBrackets();
    } else if (STATEMENT_KEYWORD_LIST.includes(curToken.value)) {
      new StatementParser(this.parser).parse(this.scope);
    } else {
      new ExpressionParser(this.parser).parse(this.scope);
    }

    owner.parts.push(this.scope);
  }

  parseArray(array) {
    for (let i = 0; i < array.length; i++) {
      this.parser.parseToken(this.scope);
      i = array.indexOf(this.parser.currentToken);
      this.parser.next();
    }
  }

  checkInsideBrackets() {
    let searchingArray;
    const tokenizer = this.parser.tokenizer;
    const curToken = this.parser.currentToken;
    this.scope.parts.push(curToken);

    const closingBracket = Utils.findClosingBracket(
      curToken,
      tokenizer.filteredTokens
    );

    searchingArray = this.parser
      .getFromCurrentToExact(closingBracket)
      .slice(1, -1);

    this.parser.next();
    this.parseArray(searchingArray);
    this.scope.parts.push(closingBracket);
  }
}
