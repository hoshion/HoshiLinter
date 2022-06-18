import { Symbols } from '../symbols.js';
import { ExpressionSurrounder } from './expression-surrounder.js';
import { TAB } from './linter.js';

const BRACKETS = [
  [Symbols.OPENING_EMPHASISE, Symbols.CLOSING_EMPHASISE],
  [Symbols.OPENING_BRACE, Symbols.CLOSING_BRACE],
  [Symbols.OPENING_ANGLE, Symbols.CLOSING_ANGLE],
  [Symbols.CLOSING_BRACKET, Symbols.CLOSING_BRACKET]
];

export class ExpressionLinter {
  str = Symbols.NOTHING;
  expression;
  structure;
  linter;

  constructor(expression, structure, linter) {
    this.expression = expression;
    this.structure = structure;
    this.linter = linter;
  }

  lint() {
    for (let i = 0; i < this.expression.parts.length; i++) {
      this.str += this.lintPart(i);
    }

    this.str = new ExpressionSurrounder(this.linter, this.str).surround(this.expression, this.structure);
    return this.str;
  }

  lintPart(index) {
    const part = this.expression.parts[index];

    if (this.linter.isStructure(part.constructor.name)) {
      return this.linter.lintStructure(part, this.expression.parts);
    }

    return this.lintToken(part, index);
  }

  lintToken(token, index) {
    switch (token.value) {
    case Symbols.PLUS:
      return this.addSpace() + token.value + (
        this.isNext('string', index) ?
          Symbols.NOTHING :
          Symbols.SPACE
      );

    case Symbols.OPENING_BRACE:
      this.linter.tabSpace += TAB;
      return Symbols.OPENING_BRACE + Symbols.NEW_LINE + this.linter.tab();

    case Symbols.CLOSING_BRACE:
      this.linter.tabSpace -= TAB;
      return Symbols.NEW_LINE + this.linter.tab() + Symbols.CLOSING_BRACE;

    case Symbols.COMMA:
      if (this.isNewLine()) {
        return Symbols.COMMA + Symbols.NEW_LINE + this.linter.tab();
      } else {
        return Symbols.COMMA + Symbols.SPACE;
      }

    default: {
      if (token.type === 'keyword' || (token.type.endsWith('operator') && token.value !== Symbols.DOT)) {
        return this.addSpace() + token.value + (
          this.isNext('dot-operator', index) || this.isNext('closing-parenthesis', index) ?
            Symbols.NOTHING :
            Symbols.SPACE
        );
      } else { return token.value; }
    }
    }
  }

  isNext(type, index) {
    return this.expression.parts[index + 1] && this.expression.parts[index + 1]?.type === type;
  }

  isNewLine() {
    const indexes = new Map([
      [Symbols.OPENING_EMPHASISE, 0],
      [Symbols.OPENING_BRACE, 0],
      [Symbols.OPENING_BRACKET, 0],
      [Symbols.OPENING_ANGLE, 0]
    ]);
    for (let i = 0; i < this.str.length; i++) {
      for (const [open, close] of BRACKETS) {
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
    return index ?
      isNewLine :
      false;
  }

  bracketIndex(symbol, openingSymbol, closingSymbol, index) {
    if (symbol === openingSymbol) return index;
    else if (symbol === closingSymbol) return -1;
  }

  addSpace() {
    if (
      !this.str.endsWith(Symbols.SPACE) &&
      !this.str.endsWith(Symbols.OPENING_EMPHASISE) &&
      this.str !== Symbols.NOTHING
    ) { return Symbols.SPACE; } else { return Symbols.NOTHING; }
  }
}
