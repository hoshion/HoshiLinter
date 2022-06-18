import { Expression } from '../parser/expression-parser/expression.js';
import { Token } from '../tokenizer/token.js';
import { Symbols } from '../symbols.js';
import { Utils } from '../utils/utils.js';

export class ExpressionSurrounder {
  linter;
  str;

  constructor(linter, str) {
    this.linter = linter;
    this.str = str;
  }

  surround(part, structure) {
    const i = structure.indexOf(part);

    const prev = structure[i - 1];
    const next = structure[i + 1];

    if (prev && prev instanceof Expression) {
      const lines = this.getLines(prev, part);
      if (lines > 1) this.str = this.newLine(lines - 1) + this.linter.tab() + this.str;
    }

    if (!next || !(next instanceof Token) || next.value !== Symbols.CLOSING_EMPHASISE) {
      this.str += Symbols.SEMICOLON;
    }

    if (next && next instanceof Expression) {
      this.str += Symbols.NEW_LINE + this.linter.tab();
    }

    return this.str;
  }

  newLine(amount) {
    return Symbols.NEW_LINE.repeat(amount);
  }

  getLines(firstExpression, secondExpression) {
    const planedArray = Utils.plane(firstExpression.parts);
    const index = planedArray.length - 1;
    return secondExpression.parts[0].row - planedArray[index].row;
  }
}
