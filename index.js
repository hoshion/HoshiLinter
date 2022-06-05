import {Tokenizer} from "./tokenizer.js";
import fs from "fs"
import vm from "vm";

const fileName = (process.argv[2] && process.argv[2] !== "--fullLog") ? process.argv[2] : "test.js";
const fullLog = process.argv.includes("--fullLog");

const file = fs.readFileSync(`./${fileName}`, 'utf8');

try {
  new vm.Script(file);
} catch (e) {
  console.log("Before using linter you should fix syntax errors:");
  throw e;
}

const tokenizer = new Tokenizer(file);

tokenizer.tokenize();
tokenizer.log(fullLog);