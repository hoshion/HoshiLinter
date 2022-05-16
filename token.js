export class Token {
  row;
  col;
  type;
  value;

  constructor(row, col, type = "undefined", value = "null") {
    this.row = row;
    this.col = col;
    this.type = type;
    this.value = value;
  }
}