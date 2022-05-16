import {Tokenizer} from "./tokenizer.js";
import fs from "fs"

const file = fs.readFileSync("./test.js").toString();
const tokenizer = new Tokenizer(file);

tokenizer.log();