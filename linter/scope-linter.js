import { Symbols } from '../symbols.js';
import { TAB } from './linter.js';

export class ScopeLinter {
  str = Symbols.NOTHING;
  scope;
  structure;
  linter;

  constructor(scope, structure, linter) {
    this.scope = scope;
    this.structure = structure;
    this.linter = linter;
  }

  lint() {
    this.linter.tabSpace += TAB;

    for (let i = 0; i < this.scope.parts.length; i++) {
      this.str += this.lintPart(i);
    }

    this.surround();

    return this.str;
  }

  lintPart(index) {
    const part = this.scope.parts[index];

    if (this.linter.isStructure(part.constructor.name)) {
      return this.linter.lintStructure(part, this.scope.parts);
    }

    switch (part.value) {
    case Symbols.OPENING_BRACE:
      return Symbols.SPACE + Symbols.OPENING_BRACE + Symbols.NEW_LINE + this.linter.tab();
    case Symbols.CLOSING_BRACE:
      this.linter.tabSpace -= TAB;
      return Symbols.NEW_LINE + this.linter.tab() + Symbols.CLOSING_BRACE;
    default:
      return Symbols.NOTHING;
    }
  }

  surround() {
    if (this.scope.parts[0]?.value !== Symbols.OPENING_BRACE) {
      this.str = Symbols.NEW_LINE + this.linter.tab() + this.str;
    }

    const lastIndex = this.scope.parts.length - 1;

    if (this.scope.parts[lastIndex]?.value !== Symbols.CLOSING_BRACE) {
      this.linter.tabSpace -= TAB;
      this.str += Symbols.NEW_LINE + this.linter.tab();
    }
  }
}
