import {Tokenizer} from "./tokenizer.js";
import fs from "fs";
import { execSync } from "child_process";

const fileName = (process.argv[2] && process.argv[2] !== "--fullLog") ? process.argv[2] : "test.js";
const fullLog = process.argv.includes("--fullLog");

const file = fs.readFileSync(`./${fileName}`, 'utf8');

try {
  execSync(`node --check ${fileName}`, {encoding: "utf8", stdio: "pipe"});
} catch (e) {
  console.log('Before executing the linter please fix syntax errors:\n' + e.stderr)
}

const tokenizer = new Tokenizer(file);

tokenizer.tokenize();
tokenizer.log(fullLog);