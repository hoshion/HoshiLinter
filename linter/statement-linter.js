import { statementKeywordsList } from '../parser/parser.js';
import { Symbols } from '../symbols.js';
import { Utils } from '../utils/utils.js';

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
    if (this.statement.type === 'import') {
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
    return token.value + (statementKeywordsList.includes(token.value) ?
      Symbols.SPACE :
      Symbols.NOTHING
    );
  }

  surround() {
    if (this.statement.parts[0].value === 'export') this.str = Symbols.NEW_LINE + this.linter.tab() + this.str;

    // const lastIndex = this.statement.parts.length - 1;
    this.str += Symbols.NEW_LINE + this.linter.tab();
  }
}
