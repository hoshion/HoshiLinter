import { Tokenizer } from "./tokenizer/tokenizer.js";
import fs from "fs";
import { execSync } from "child_process";
import { Parser } from "./parser/parser.js";
import { Linter } from "./linter/linter.js";

const fileName =
  process.argv[2] && process.argv[2] !== "--fullLog"
    ? process.argv[2]
    : "test.js";

const file = fs.readFileSync(`./${fileName}`, "utf8");

try {
  execSync(`node --check ${fileName}`, { encoding: "utf8", stdio: "pipe" });
} catch (e) {
  console.log(
    "Before executing the linter please fix syntax errors:\n" + e.stderr
  );
  process.exit();
}

const tokenizer = new Tokenizer(file);

tokenizer.tokenize();

const parser = new Parser(tokenizer);

parser.parse();

const linter = new Linter(parser.parts, fileName);

linter.lint();
