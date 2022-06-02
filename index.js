import {Tokenizer} from "./tokenizer.js";
import fs from "fs"

String.prototype.matches = function (regexp) {
  const matches = this.match(regexp);
  if (matches == null) return false;
  return matches[0] === String(this);
}

const fileName = (process.argv[2] && process.argv[2] !== "--fullLog") ? process.argv[2] : "test.js";
const fullLog = process.argv.includes("--fullLog");


const file = fs.readFileSync(`./${fileName}`).toString();
const tokenizer = new Tokenizer(file);

tokenizer.tokenize();
tokenizer.log(fullLog);