import { TokenTypes } from "../../token-types.js";

export class Statement {
  type;
  parts = [];

  constructor(type = TokenTypes.UNDEFINED) {
    this.type = type;
  }
}
