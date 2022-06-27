import { Symbols } from '../../enums/symbols.js';
import { Utils } from '../../utils/utils.js';
import { SurrounderUtils } from '../../utils/surrounder-utils.js';
import { Keywords } from '../../enums/keywords.js';
import { TokenTypes } from '../../enums/token-types.js';
import { StructureLinter } from '../structure-linter.js';

export class StatementLinter extends StructureLinter {
  str = Symbols.NOTHING;

  lint() {
    if (this.current.type === Keywords.IMPORT) {
      const arr = Utils.plane(this.statement.parts);
      for (const token of arr) {
        this.lintToken(token);
      }
      return this.str;
    }

    for (let i = 0; i < this.current.parts.length; i++) {
      this.str += this.lintPart(i);
    }

    this.surround();
    return this.str;
  }

  lintPart(index) {
    const part = this.current.parts[index];

    if (this.linter.isStructure(part.constructor.name)) {
      return this.linter.lintStructure(part, this.current.parts);
    }

    return this.lintToken(part);
  }

  lintToken(token) {
    const spaceAfterToken = token.isType(TokenTypes.KEYWORD) ?
      Symbols.SPACE :
      Symbols.NOTHING;
    const spaceBeforeToken = token.is(Symbols.CLOSING_PARENTHESIS) ?
      Symbols.NOTHING :
      this.addSpace();
    return spaceBeforeToken + token.value + spaceAfterToken;
  }

  surround() {
    SurrounderUtils.setSpaceBetweenStructures(
      this,
      this.structure,
      this.current
    );
    SurrounderUtils.setNewLineIfNext(
      this,
      this.structure,
      this.structure.indexOf(this.current)
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
