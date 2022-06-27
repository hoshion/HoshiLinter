import { Symbols } from '../enums/symbols.js';

export const BRACKETS_MAP = new Map([
  [Symbols.OPENING_BRACKET, Symbols.CLOSING_BRACKET],
  [Symbols.OPENING_BRACE, Symbols.CLOSING_BRACE],
  [Symbols.OPENING_PARENTHESIS, Symbols.CLOSING_PARENTHESIS]
]);

export const BRACKETS = [
  Symbols.OPENING_BRACKET,
  Symbols.CLOSING_BRACKET,
  Symbols.OPENING_BRACE,
  Symbols.CLOSING_BRACE,
  Symbols.OPENING_PARENTHESIS,
  Symbols.CLOSING_PARENTHESIS
];

export class Utils {
  static findClosingBracket(opening, tokens) {
    let counter = 1;
    const array = tokens.slice(tokens.indexOf(opening) + 1);

    let closing;
    for (closing of array) {
      if (closing.value === opening.value) counter++;
      if (closing.value === BRACKETS_MAP.get(opening.value)) counter--;
      if (counter === 0) break;
    }

    return closing;
  }

  static joinTokens(filteredTokens, allTokens, key) {
    const copyArray = Array.from(filteredTokens);
    for (const token of allTokens) {
      if (token.isType(key)) {
        if (filteredTokens[0].index > token.index) continue;
        const index = this.findIndex(copyArray, token.index);
        copyArray.splice(index, 0, token);
      }
    }
    return copyArray;
  }

  static findIndex(filteredTokens, index) {
    for (const token of filteredTokens) {
      if (token.index > index) return filteredTokens.indexOf(token);
    }
    return filteredTokens.length;
  }

  static plane(parts) {
    const res = [];
    for (const part of parts) {
      if (part.parts) res.push(...this.plane(part.parts));
      else {
        res.push(part);
      }
    }
    return res;
  }
}
