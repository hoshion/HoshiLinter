import { Symbols } from "../enums/symbols.js";
import fs from "fs";
import { ExpressionLinter } from "./expression-linter/expression-linter.js";
import { ScopeLinter } from "./scope-linter/scope-linter.js";
import { StatementLinter } from "./statement-linter/statement-linter.js";
import { Structures } from "../enums/structures.js";

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
      console.log("Successfully linted");
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
    for (const value of Object.values(Structures)) {
      if (value === name) return true;
    }

    return false;
  }

  lintStructure(part, parts) {
    const name = part.constructor.name;
    if (name === Structures.EXPRESSION) {
      return new ExpressionLinter(part, parts, this).lint();
    } else if (name === Structures.SCOPE) {
      return new ScopeLinter(part, parts, this).lint();
    } else if (name === Structures.STATEMENT) {
      return new StatementLinter(part, parts, this).lint();
    }
  }

  tab() {
    return Symbols.SPACE.repeat(this.tabSpace >= 0 ? this.tabSpace : 0);
  }
}
