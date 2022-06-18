export class Statement {
  type;
  parts = [];

  constructor(type = 'undefined') {
    this.type = type;
  }
}
