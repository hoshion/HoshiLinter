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
    const closingBracket = BRACKETS_MAP.get(opening.value);

    let closing;
    for (closing of array) {
      const isOpening = closing.is(opening.value);
      const isClosing = closing.is(closingBracket);
      counter += isOpening - isClosing;

      if (counter === 0) break;
    }

    return closing;
  }

  static joinTokens(filteredTokens, allTokens, key) {
    const copyArray = [...filteredTokens];
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
    const resultIndex = filteredTokens.findIndex((token) => token.index > index);
    return resultIndex === -1 ?
      filteredTokens.length :
      resultIndex;
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
