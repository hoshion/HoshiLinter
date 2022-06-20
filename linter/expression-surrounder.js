import { Token } from '../tokenizer/token.js';
import { Symbols } from '../symbols.js';
import { Utils } from '../utils/utils.js';
import {SurrounderUtils} from "./surrounder-utils.js";

export class ExpressionSurrounder {
  linter;
  str;

  constructor(linter, str) {
    this.linter = linter;
    this.str = str;
  }

  surround(part, structure) {
    const i = structure.indexOf(part);

    const next = structure[i + 1];

    const isNextComma = next && next instanceof Token && next.value === Symbols.CLOSING_PARENTHESIS;

    if (!isNextComma && !this.isEndedByClosingBrace(part)) {
      this.str += Symbols.SEMICOLON;
    }

    SurrounderUtils.setSpaceBetweenStructures(this, structure, part);
    SurrounderUtils.setNewLineIfNext(this, structure, i);

    return this.str;
  }

  isEndedByClosingBrace(part) {
    const token = Utils.plane(part.parts).pop();
    return token.is(Symbols.CLOSING_BRACE);
  }
}
