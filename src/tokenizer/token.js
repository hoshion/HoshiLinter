import { Operators } from '../enums/operators.js';

export class Token {
  static INDEX = 1;
  row;
  col;
  type;
  value;
  length;
  index;

  constructor(row, col, type = 'undefined', value = 'null') {
    this.row = row;
    this.col = col;
    this.type = type;
    this.value = value;
    this.length = 4;
    this.index = Token.INDEX++;
  }

  is(value) {
    return this.value === value;
  }

  isType(type) {
    return this.type === type;
  }

  isOperator() {
    const values = Object.values(Operators);
    return values.some(value => value === this.type);
  }
}
