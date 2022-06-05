export const bracketsMap = new Map([
  ['[', ']'],
  ['{', '}'],
  ['(', ')'],
  ['<', '>'],
])

export class Utils {

  static findClosingBracketId(opening, tokens) {
    let counter = 1;
    const array = tokens.slice(opening.index);

    let closing;
    for (closing of array) {
      if (counter === 0) break;
      if (closing.value === opening.value) counter++;
      if (closing.value === bracketsMap.get(opening.value)) counter--;
    }

    return closing.index;
  }
}