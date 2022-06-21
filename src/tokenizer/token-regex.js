
import { TokenTypes } from '../enums/token-types.js';
import { Operators } from '../enums/operators.js';

/* eslint-disable */
const keywordRegex =
  /^(await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|false|finally|for|function|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|super|switch|static|this|throw|try|true|typeof|var|void|while|with|yield)(?![A-Za-z0-9$_])/;

export const TOKEN_TYPES = new Map([
  [TokenTypes.COMMENT, /^\/\/.+/],
  [TokenTypes.MULTILINE_COMMENT, /^\/\*.*?\*\//s],
  [TokenTypes.SEMICOLON, /^;/],
  [TokenTypes.WHITESPACE, /^ +/],
  [TokenTypes.END_OF_LINE, /^(\r\n|\n)/],
  [TokenTypes.REGEX, /^\/.*?(?<!\\)\/[dgimsuy]*/s],

  [Operators.ARITHMETIC, /^(\+\+|--|\*\*(?!=)|[+\-\/*%](?![=\-+*]))/],
  [Operators.LOGICAL, /^(\|\||&&|!)(?!=)/],
  [Operators.DOT, /^\./],
  [Operators.COMMA, /^,/],
  [
    Operators.ASSIGNMENT,
    /^(=(?![=>])|(\+|-|\*|\/|%|\*\*|\?\?|\|\||&&|&|\||\^|<<|>>|>>>)=)/,
  ],
  [Operators.COMPARING, /^([><](?![=><])|==(?!=)|<=|>=|===|!=(?!=)|!==)/],
  [Operators.NULLISH, /^\?\?(?!=)/],
  [Operators.QUESTION_MARK, /^\?/],
  [Operators.COLON, /^:/],
  [Operators.BITWISE, /^(&(?!&)|\|(?!\|)|\^|<<|>>|>>>|~)(?!=)/],
  [Operators.ARROW, /^=>/],

  [TokenTypes.OPENING_BRACE, /^{/],
  [TokenTypes.CLOSING_BRACE, /^}/],
  [TokenTypes.OPENING_BRACKET, /^\[/],
  [TokenTypes.CLOSING_BRACKET, /^]/],
  [TokenTypes.OPENING_PARENTHESIS, /^\(/],
  [TokenTypes.CLOSING_PARENTHESIS, /^\)/],

  [TokenTypes.STRING, /^('.*?(?<!\\)'|".*?(?<!\\)"|`.*?(?<!\\)`)/s],
  [TokenTypes.NUMBER, /^\d+/],
  [TokenTypes.KEYWORD, keywordRegex],
  [TokenTypes.IDENTIFIER, /^[a-zA-Z_$][a-zA-Z_$0-9]*/],
]);
