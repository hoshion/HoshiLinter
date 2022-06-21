'use strict';

import { Symbols } from '../enums/symbols.js';
import { Utils } from './utils.js';
import { Token } from '../tokenizer/token.js';

export class SurrounderUtils {
  static setNewLineIfNext(surrounder, structure, index) {
    const next = structure[index + 1];
    if (next && !(next instanceof Token)) {
      surrounder.str += Symbols.NEW_LINE + surrounder.linter.tab();
    }
  }

  static setSpaceBetweenStructures(surrounder, structure, part) {
    const i = structure.indexOf(part);
    const prev = structure[i - 1];
    if (prev && !(prev instanceof Token)) {
      const lines = this.getLines(prev, part);
      if (lines > 1) {
        surrounder.str =
          this.newLine(lines - 1) + surrounder.linter.tab() + surrounder.str;
      }
    }
  }

  static getLines(firstExpression, secondExpression) {
    const planedArray = Utils.plane(firstExpression.parts);
    const index = planedArray.length - 1;
    return secondExpression.parts[0].row - planedArray[index].row;
  }

  static newLine(amount) {
    return Symbols.NEW_LINE.repeat(amount);
  }
}
