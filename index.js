import {Tokenizer} from "./tokenizer.js";
import fs from "fs"

String.prototype.matches = function (regexp) {
  const matches = this.match(regexp);
  if (matches == null) return false;
  return matches[0] === this;
}

const fullLog = process.argv.length !== 2 && process.argv[2] === "--fullLog";

const file = fs.readFileSync("./test.js").toString();
const tokenizer = new Tokenizer(file);

tokenizer.tokenize();
tokenizer.log(fullLog);