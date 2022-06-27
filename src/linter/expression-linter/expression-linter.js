import { Symbols } from '../../enums/symbols.js';
import { ExpressionSurrounder } from './expression-surrounder.js';
import { TAB } from '../linter.js';
import { TokenTypes } from '../../enums/token-types.js';
import { Operators } from '../../enums/operators.js';
import { Token } from '../../tokenizer/token.js';
import { BRACKETS_MAP } from '../../utils/utils.js';
import { StructureLinter } from '../structure-linter.js';

export class ExpressionLinter extends StructureLinter {
  str = Symbols.NOTHING;
  index;

  lint() {
    for (this.index = 0; this.index < this.current.parts.length; this.index++) {
      this.str += this.lintPart();
    }

    this.str = new ExpressionSurrounder(this.linter, this.str).surround(
      this.current,
      this.structure
    );
    return this.str;
  }

  lintPart() {
    const part = this.current.parts[this.index];

    if (this.linter.isStructure(part.constructor.name)) {
      return this.linter.lintStructure(part, this.current.parts);
    }

    return this.lintToken(part);
  }

  lintToken(token) {
    this.updateTab(token);

    const strings = this.getStringsMap(token);

    if (strings.has(token.value)) {
      return strings.get(token.value);
    } else {
      return this.checkOtherRules(token);
    }
  }

  getStringsMap(token) {
    return new Map([
      [
        Symbols.PLUS,
        this.addSpace() +
          token.value +
          this.addSpaceNotAfter(TokenTypes.STRING),
      ],
      [
        Symbols.OPENING_BRACE,
        Symbols.OPENING_BRACE + Symbols.NEW_LINE + this.linter.tab(),
      ],
      [
        Symbols.CLOSING_BRACE,
        Symbols.NEW_LINE + this.linter.tab() + Symbols.CLOSING_BRACE,
      ],
      [
        Symbols.COMMA,
        this.isNewLine()
          ? Symbols.COMMA + Symbols.NEW_LINE + this.linter.tab()
          : Symbols.COMMA + Symbols.SPACE,
      ],
      [Symbols.DOT, token.value],
      [Symbols.EXCLAMATION_MARK, token.value],
    ]);
  }

  checkOtherRules(token) {
    const value = token.value;
    if (token.isType(TokenTypes.KEYWORD) || token.isOperator()) {
      const spaceAfter = this.addSpaceNotAfter(
        this.index,
        Operators.DOT,
        TokenTypes.CLOSING_PARENTHESIS
      );
      return this.addSpace() + value + spaceAfter;
    } else {
      return value;
    }
  }

  updateTab(token) {
    if (token.is(Symbols.OPENING_BRACE)) {
      this.linter.tabSpace += TAB;
    } else if (token.is(Symbols.CLOSING_BRACE)) {
      this.linter.tabSpace -= TAB;
    }
  }

  getNext() {
    return this.current.parts[this.index + 1];
  }

  isNewLine() {
    const indexes = new Map([
      [Symbols.OPENING_PARENTHESIS, 0],
      [Symbols.OPENING_BRACE, 0],
      [Symbols.OPENING_BRACKET, 0],
      [Symbols.OPENING_ANGLE, 0],
    ]);
    for (let i = 0; i < this.str.length; i++) {
      for (const [open, close] of BRACKETS_MAP) {
        indexes.set(open, this.bracketIndex(this.str[i], open, close, i));
      }
    }
    let isNewLine = false;
    let index = 0;
    for (const [k, i] of indexes) {
      if (i > index) {
        if (k === Symbols.OPENING_BRACE) {
          isNewLine = true;
          index = i;
        } else {
          isNewLine = false;
          index = i;
        }
      }
    }
    return index ? isNewLine : false;
  }

  bracketIndex(symbol, openingSymbol, closingSymbol, index) {
    if (symbol === openingSymbol) return index;
    else if (symbol === closingSymbol) return -1;
  }

  addSpace() {
    if (
      !this.str.endsWith(Symbols.SPACE) &&
      !this.str.endsWith(Symbols.OPENING_PARENTHESIS) &&
      this.str !== Symbols.NOTHING
    ) {
      return Symbols.SPACE;
    } else {
      return Symbols.NOTHING;
    }
  }

  check() {
    const next = this.getNext();
    return (type) => {
      if (!next) return true;
      return next && next instanceof Token && next.isType(type);
    };
  }

  addSpaceNotAfter(...types) {
    if (types.some(this.check())) {
      return Symbols.NOTHING;
    } else {
      return Symbols.SPACE;
    }
  }
}
