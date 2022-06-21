import { TokenTypes } from "../../enums/token-types.js";

export class Statement {
  type;
  parts = [];

  constructor(type = TokenTypes.UNDEFINED) {
    this.type = type;
  }
}
