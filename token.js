export class Token {
  row;
  col;
  type;
  value;
  length;
  index;

  constructor(row, col, type = "undefined", value = "null") {
    this.row = row;
    this.col = col;
    this.type = type;
    this.value = value;
    this.length = 4;
  }
}