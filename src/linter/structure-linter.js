export class StructureLinter {
  current;
  structure;
  linter;

  constructor(current, structure, linter) {
    this.current = current;
    this.structure = structure;
    this.linter = linter;
  }
}
