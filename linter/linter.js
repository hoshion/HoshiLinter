import { Symbols } from '../symbols.js';
import fs from 'fs';
import { ExpressionLinter } from './expression-linter.js';
import { ScopeLinter } from './scope-linter.js';
import { StatementLinter } from './statement-linter.js';

export const TAB = 2;

export class Linter {
  parts;
  fileName;
  tabSpace = 0;

  constructor(parts, fileName) {
    this.parts = parts;
    this.fileName = fileName;
  }

  lint(parts = this.parts) {
    let str = Symbols.NOTHING;
    for (const part of parts) {
      str += this.checkStructure(part, parts);
    }

    fs.writeFile(`./${this.fileName.slice(0, -3)}-linted.js`, str, () => {
      console.log('Successfully linted');
    });
  }

  checkStructure(part, parts) {
    const name = part.constructor.name;
    if (this.isStructure(name)) {
      return this.lintStructure(part, parts);
    }
    return Symbols.NOTHING;
  }

  isStructure(name) {
    return name === 'Scope' || name === 'Expression' || name === 'Statement';
  }

  lintStructure(part, parts) {
    switch (part.constructor.name) {
    case 'Expression': return new ExpressionLinter(part, parts, this).lint();
    case 'Scope': return new ScopeLinter(part, parts, this).lint();
    case 'Statement': return new StatementLinter(part, parts, this).lint();
    }
  }

  tab() {
    return Symbols.SPACE.repeat(this.tabSpace);
  }
}
