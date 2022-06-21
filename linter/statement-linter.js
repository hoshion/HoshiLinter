import { Symbols } from "../symbols.js";
import { Utils } from "../utils/utils.js";
import { SurrounderUtils } from "./surrounder-utils.js";
import { Keywords } from "../keywords.js";
import { TokenTypes } from "../token-types.js";

export class StatementLinter {
  str = Symbols.NOTHING;
  statement;
  structure;
  linter;

  constructor(statement, structure, linter) {
    this.statement = statement;
    this.structure = structure;
    this.linter = linter;
  }

  lint() {
    if (this.statement.type === Keywords.IMPORT) {
      const arr = Utils.plane(this.statement.parts);
      for (const token of arr) {
        this.lintToken(token);
      }
      return this.str;
    }

    for (let i = 0; i < this.statement.parts.length; i++) {
      this.str += this.lintPart(i);
    }

    this.surround();
    return this.str;
  }

  lintPart(index) {
    const part = this.statement.parts[index];

    if (this.linter.isStructure(part.constructor.name)) {
      return this.linter.lintStructure(part, this.statement.parts);
    }

    return this.lintToken(part);
  }

  lintToken(token) {
    const spaceAfterToken = token.isType(TokenTypes.KEYWORD)
      ? Symbols.SPACE
      : Symbols.NOTHING;
    return this.addSpace() + token.value + spaceAfterToken;
  }

  surround() {
    SurrounderUtils.setSpaceBetweenStructures(
      this,
      this.structure,
      this.statement
    );
    SurrounderUtils.setNewLineIfNext(
      this,
      this.structure,
      this.structure.indexOf(this.statement)
    );
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
}
