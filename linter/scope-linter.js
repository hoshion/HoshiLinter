import { Symbols } from '../symbols.js';
import { TAB } from './linter.js';
import {Token} from "../tokenizer/token.js";
import {Keywords} from "../keywords.js";

export class ScopeLinter {
  str = Symbols.NOTHING;
  scope;
  structure;
  linter;
  isTabbed = true;
  isNewLinedBefore = true;
  isBraced = false;

  constructor(scope, structure, linter) {
    this.scope = scope;
    this.structure = structure;
    this.linter = linter;
  }

  lint() {
    if (this.checkPreviousToken(Keywords.ELSE)) {
      this.isNewLinedBefore = false;
      this.isTabbed = false;
    }

    this.addTab();

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

    return this.lintToken(part);
  }

  lintToken(token) {
    if (token.is(Symbols.OPENING_BRACE)) {
      this.isBraced = true;
      return Symbols.SPACE + Symbols.OPENING_BRACE + Symbols.NEW_LINE + this.linter.tab();
    } else if (token.is(Symbols.CLOSING_BRACE)) {
      this.removeTab();
      return Symbols.NEW_LINE + this.linter.tab() + Symbols.CLOSING_BRACE;
    } else {
      return Symbols.NOTHING;
    }
  }

  surround() {
    if (!this.isBraced && this.isNewLinedBefore) {
      this.str = Symbols.NEW_LINE + this.linter.tab() + this.str;
    }

    if (!this.isBraced) {
      this.removeTab();
    }
  }

  checkPreviousToken(value) {
    const index = this.structure.indexOf(this.scope) - 1;
    const part = this.structure[index];
    return part && part instanceof Token && part.is(value);
  }

  addTab() {
    if (this.isTabbed) {
      this.linter.tabSpace += TAB;
    }
  }

  removeTab() {
    if (this.isTabbed) {
      this.linter.tabSpace -= TAB;
    }
  }
}
