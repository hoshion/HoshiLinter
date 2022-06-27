import { Keywords } from '../../enums/keywords.js';
import { Symbols } from '../../enums/symbols.js';
import { Structures } from '../../enums/structures.js';
import { TokenTypes } from '../../enums/token-types.js';

export const STATEMENTS_STRUCTURES = new Map([
  [
    Keywords.IF,
    [
      Symbols.OPENING_PARENTHESIS,
      Structures.EXPRESSION,
      Symbols.CLOSING_PARENTHESIS,
      Structures.SCOPE,
      [Symbols.QUESTION_MARK, Keywords.ELSE, Structures.SCOPE],
    ],
  ],
  [
    Keywords.FOR,
    [
      Symbols.OPENING_PARENTHESIS,
      Structures.EXPRESSION,
      [Symbols.QUESTION_MARK, Structures.EXPRESSION, Structures.EXPRESSION],
      Symbols.CLOSING_PARENTHESIS,
      Structures.SCOPE,
    ],
  ],
  [
    Keywords.FUNCTION,
    [
      TokenTypes.IDENTIFIER,
      Symbols.OPENING_PARENTHESIS,
      Structures.EXPRESSION,
      Symbols.CLOSING_PARENTHESIS,
      Structures.SCOPE,
    ],
  ],
  [
    Keywords.DO,
    [
      Structures.SCOPE,
      Keywords.WHILE,
      Symbols.OPENING_PARENTHESIS,
      Structures.EXPRESSION,
      Symbols.CLOSING_PARENTHESIS,
    ],
  ],
  [
    Keywords.WHILE,
    [
      Symbols.OPENING_PARENTHESIS,
      Structures.EXPRESSION,
      Symbols.CLOSING_PARENTHESIS,
      Structures.SCOPE,
    ],
  ],
  [Keywords.THROW, [Structures.EXPRESSION]],
  [Keywords.CLASS, [TokenTypes.IDENTIFIER, Structures.SCOPE]],
  [
    Keywords.SWITCH,
    [
      Symbols.OPENING_PARENTHESIS,
      Structures.EXPRESSION,
      Symbols.CLOSING_PARENTHESIS,
      Structures.SCOPE,
    ],
  ],
  [Keywords.LET, [Structures.EXPRESSION]],
  [Keywords.CONST, [Structures.EXPRESSION]],
  [Keywords.VAR, [Structures.EXPRESSION]],
  [Keywords.IMPORT, [Structures.SCOPE, Keywords.FROM, TokenTypes.IDENTIFIER]],
  [
    Keywords.EXPORT,
    [[Symbols.QUESTION_MARK, Keywords.DEFAULT], Structures.SCOPE],
  ],
  [
    Keywords.TRY,
    [
      Structures.SCOPE,
      [
        Symbols.QUESTION_MARK,
        Keywords.CATCH,
        Symbols.OPENING_PARENTHESIS,
        Structures.EXPRESSION,
        Symbols.CLOSING_PARENTHESIS,
        Structures.SCOPE,
      ],
      [Symbols.QUESTION_MARK, Keywords.FINALLY, Structures.SCOPE],
    ],
  ],
]);
