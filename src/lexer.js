// WAZOBIA Lexer / Tokenizer
import { KEYWORD_LOOKUP, normalizeDiacritics } from './dictionary.js';

export const TokenType = {
  EOF: 'EOF',
  NUMBER: 'NUMBER',
  STRING: 'STRING',
  IDENTIFIER: 'IDENTIFIER',

  // Canonical Keywords
  KW_FOR: 'KW_FOR',
  KW_IN: 'KW_IN',
  KW_WHILE: 'KW_WHILE',
  KW_IF: 'KW_IF',
  KW_ELIF: 'KW_ELIF',
  KW_ELSE: 'KW_ELSE',
  KW_AND: 'KW_AND',
  KW_OR: 'KW_OR',
  KW_NOT: 'KW_NOT',
  KW_LET: 'KW_LET',
  KW_CONST: 'KW_CONST',
  KW_FN: 'KW_FN',
  KW_RETURN: 'KW_RETURN',
  KW_TRUE: 'KW_TRUE',
  KW_FALSE: 'KW_FALSE',
  KW_NULL: 'KW_NULL',
  KW_CLASS: 'KW_CLASS',
  KW_NEW: 'KW_NEW',
  KW_THIS: 'KW_THIS',
  KW_TRY: 'KW_TRY',
  KW_CATCH: 'KW_CATCH',
  KW_FINALLY: 'KW_FINALLY',
  KW_THROW: 'KW_THROW',
  KW_ASYNC: 'KW_ASYNC',
  KW_AWAIT: 'KW_AWAIT',
  KW_IMPORT: 'KW_IMPORT',
  KW_FROM: 'KW_FROM',
  KW_EXPORT: 'KW_EXPORT',
  KW_AS: 'KW_AS',
  KW_PRINT: 'KW_PRINT',
  KW_JS: 'KW_JS',
  KW_PY: 'KW_PY',

  // Operators
  PLUS: '+',
  MINUS: '-',
  STAR: '*',
  SLASH: '/',
  PERCENT: '%',
  POWER: '**',
  DOT_DOT: '..',
  DOT: '.',
  COMMA: ',',
  COLON: ':',
  SEMICOLON: ';',

  // Delimiters
  LPAREN: '(',
  RPAREN: ')',
  LBRACE: '{',
  RBRACE: '}',
  LBRACKET: '[',
  RBRACKET: ']',

  // Comparisons & Assignment
  ASSIGN: '=',
  PLUS_ASSIGN: '+=',
  MINUS_ASSIGN: '-=',
  STAR_ASSIGN: '*=',
  SLASH_ASSIGN: '/=',
  EQUAL: '==',
  NOT_EQUAL: '!=',
  LT: '<',
  LTE: '<=',
  GT: '>',
  GTE: '>='
};

export class Token {
  constructor(type, value, line, col, raw = value) {
    this.type = type;
    this.value = value;
    this.line = line;
    this.col = col;
    this.raw = raw;
  }
}

export class Lexer {
  constructor(source, options = {}) {
    this.source = source;
    this.options = options;
    this.pos = 0;
    this.line = 1;
    this.col = 1;
    this.length = source.length;
  }

  peek(offset = 0) {
    const idx = this.pos + offset;
    return idx < this.length ? this.source[idx] : '\0';
  }

  advance() {
    const ch = this.peek();
    this.pos++;
    if (ch === '\n') {
      this.line++;
      this.col = 1;
    } else {
      this.col++;
    }
    return ch;
  }

  skipWhitespaceAndComments() {
    while (this.pos < this.length) {
      const ch = this.peek();
      if (ch === ' ' || ch === '\t' || ch === '\r' || ch === '\n') {
        this.advance();
      } else if (ch === '/' && this.peek(1) === '/') {
        // Single-line comment //
        while (this.pos < this.length && this.peek() !== '\n') {
          this.advance();
        }
      } else if (ch === '#') {
        // Python-style single line comment
        while (this.pos < this.length && this.peek() !== '\n') {
          this.advance();
        }
      } else if (ch === '/' && this.peek(1) === '*') {
        // Multi-line comment /* ... */
        this.advance(); // /
        this.advance(); // *
        while (this.pos < this.length && !(this.peek() === '*' && this.peek(1) === '/')) {
          this.advance();
        }
        if (this.pos < this.length) {
          this.advance(); // *
          this.advance(); // /
        }
      } else {
        break;
      }
    }
  }

  readNumber() {
    const startLine = this.line;
    const startCol = this.col;
    let str = '';
    let isFloat = false;

    while (this.pos < this.length && /[0-9]/.test(this.peek())) {
      str += this.advance();
    }

    if (this.peek() === '.' && /[0-9]/.test(this.peek(1))) {
      isFloat = true;
      str += this.advance(); // .
      while (this.pos < this.length && /[0-9]/.test(this.peek())) {
        str += this.advance();
      }
    }

    return new Token(TokenType.NUMBER, isFloat ? parseFloat(str) : parseInt(str, 10), startLine, startCol, str);
  }

  readString(quote) {
    const startLine = this.line;
    const startCol = this.col;
    this.advance(); // consume opening quote
    let str = '';

    while (this.pos < this.length && this.peek() !== quote) {
      let ch = this.advance();
      if (ch === '\\') {
        const next = this.advance();
        switch (next) {
          case 'n': str += '\n'; break;
          case 't': str += '\t'; break;
          case 'r': str += '\r'; break;
          case '\\': str += '\\'; break;
          case '"': str += '"'; break;
          case "'": str += "'"; break;
          default: str += next; break;
        }
      } else {
        str += ch;
      }
    }

    if (this.peek() === quote) {
      this.advance(); // consume closing quote
    } else {
      throw new Error(`Syntax Error: Unterminated string literal at line ${startLine}:${startCol}`);
    }

    return new Token(TokenType.STRING, str, startLine, startCol, `"${str}"`);
  }

  isIdentifierStart(ch) {
    return /[\p{L}_]/u.test(ch);
  }

  isIdentifierPart(ch) {
    return /[\p{L}\p{N}_]/u.test(ch);
  }

  detectDialect() {
    if (this.options.dialect) return this.options.dialect;
    // Inspect source for dialect markers
    const s = this.source.toLowerCase();
    if (/\b(buga|bari|aiki|cikin|harshen|koma|gaskiya)\b/.test(s)) return 'ha';
    if (/\b(te|tẹ|gbiyanju|gbìyànjú|bikoṣe|bikose|ninu|nínú|otito|òótọ́|pada)\b/.test(s)) return 'yo';
    if (/\b(dee|otu|nime|eziokwu|maka|abughi|oburu|lota)\b/.test(s)) return 'ig';
    return 'en';
  }

  readIdentifier() {
    const startLine = this.line;
    const startCol = this.col;
    let raw = '';

    while (this.pos < this.length && this.isIdentifierPart(this.peek())) {
      raw += this.advance();
    }

    const lower = raw.toLowerCase();
    const normalized = normalizeDiacritics(lower);
    const dialect = this.dialect || (this.dialect = this.detectDialect());

    // Resolve homograph: 'ko' is 'OR' in Hausa, but 'NOT' in Yoruba
    if (lower === 'ko') {
      if (dialect === 'ha') {
        return new Token(TokenType.KW_OR, 'or', startLine, startCol, raw);
      } else {
        return new Token(TokenType.KW_NOT, 'not', startLine, startCol, raw);
      }
    }

    // Check if canonical keyword
    const matchedCanonical = KEYWORD_LOOKUP.get(lower) || KEYWORD_LOOKUP.get(normalized);

    if (matchedCanonical) {
      const tokenType = TokenType[`KW_${matchedCanonical}`];
      if (tokenType) {
        return new Token(tokenType, matchedCanonical.toLowerCase(), startLine, startCol, raw);
      }
    }

    return new Token(TokenType.IDENTIFIER, raw, startLine, startCol, raw);
  }

  tokenize() {
    const tokens = [];

    while (this.pos < this.length) {
      this.skipWhitespaceAndComments();
      if (this.pos >= this.length) break;

      const ch = this.peek();
      const startLine = this.line;
      const startCol = this.col;

      if (/[0-9]/.test(ch)) {
        tokens.push(this.readNumber());
      } else if (ch === '"' || ch === "'") {
        tokens.push(this.readString(ch));
      } else if (this.isIdentifierStart(ch)) {
        tokens.push(this.readIdentifier());
      } else if (ch === '.' && this.peek(1) === '.') {
        this.advance();
        this.advance();
        tokens.push(new Token(TokenType.DOT_DOT, '..', startLine, startCol));
      } else if (ch === '.' ) {
        this.advance();
        tokens.push(new Token(TokenType.DOT, '.', startLine, startCol));
      } else if (ch === ',') {
        this.advance();
        tokens.push(new Token(TokenType.COMMA, ',', startLine, startCol));
      } else if (ch === ':') {
        this.advance();
        tokens.push(new Token(TokenType.COLON, ':', startLine, startCol));
      } else if (ch === ';') {
        this.advance();
        tokens.push(new Token(TokenType.SEMICOLON, ';', startLine, startCol));
      } else if (ch === '(') {
        this.advance();
        tokens.push(new Token(TokenType.LPAREN, '(', startLine, startCol));
      } else if (ch === ')') {
        this.advance();
        tokens.push(new Token(TokenType.RPAREN, ')', startLine, startCol));
      } else if (ch === '{') {
        this.advance();
        tokens.push(new Token(TokenType.LBRACE, '{', startLine, startCol));
      } else if (ch === '}') {
        this.advance();
        tokens.push(new Token(TokenType.RBRACE, '}', startLine, startCol));
      } else if (ch === '[') {
        this.advance();
        tokens.push(new Token(TokenType.LBRACKET, '[', startLine, startCol));
      } else if (ch === ']') {
        this.advance();
        tokens.push(new Token(TokenType.RBRACKET, ']', startLine, startCol));
      } else if (ch === '=' && this.peek(1) === '=') {
        this.advance(); this.advance();
        tokens.push(new Token(TokenType.EQUAL, '==', startLine, startCol));
      } else if (ch === '=') {
        this.advance();
        tokens.push(new Token(TokenType.ASSIGN, '=', startLine, startCol));
      } else if (ch === '!' && this.peek(1) === '=') {
        this.advance(); this.advance();
        tokens.push(new Token(TokenType.NOT_EQUAL, '!=', startLine, startCol));
      } else if (ch === '!') {
        this.advance();
        tokens.push(new Token(TokenType.KW_NOT, 'not', startLine, startCol));
      } else if (ch === '<' && this.peek(1) === '=') {
        this.advance(); this.advance();
        tokens.push(new Token(TokenType.LTE, '<=', startLine, startCol));
      } else if (ch === '<') {
        this.advance();
        tokens.push(new Token(TokenType.LT, '<', startLine, startCol));
      } else if (ch === '>' && this.peek(1) === '=') {
        this.advance(); this.advance();
        tokens.push(new Token(TokenType.GTE, '>=', startLine, startCol));
      } else if (ch === '>') {
        this.advance();
        tokens.push(new Token(TokenType.GT, '>', startLine, startCol));
      } else if (ch === '&' && this.peek(1) === '&') {
        this.advance(); this.advance();
        tokens.push(new Token(TokenType.KW_AND, 'and', startLine, startCol));
      } else if (ch === '|' && this.peek(1) === '|') {
        this.advance(); this.advance();
        tokens.push(new Token(TokenType.KW_OR, 'or', startLine, startCol));
      } else if (ch === '+' && this.peek(1) === '=') {
        this.advance(); this.advance();
        tokens.push(new Token(TokenType.PLUS_ASSIGN, '+=', startLine, startCol));
      } else if (ch === '+') {
        this.advance();
        tokens.push(new Token(TokenType.PLUS, '+', startLine, startCol));
      } else if (ch === '-' && this.peek(1) === '=') {
        this.advance(); this.advance();
        tokens.push(new Token(TokenType.MINUS_ASSIGN, '-=', startLine, startCol));
      } else if (ch === '-') {
        this.advance();
        tokens.push(new Token(TokenType.MINUS, '-', startLine, startCol));
      } else if (ch === '*' && this.peek(1) === '*') {
        this.advance(); this.advance();
        tokens.push(new Token(TokenType.POWER, '**', startLine, startCol));
      } else if (ch === '*' && this.peek(1) === '=') {
        this.advance(); this.advance();
        tokens.push(new Token(TokenType.STAR_ASSIGN, '*=', startLine, startCol));
      } else if (ch === '*') {
        this.advance();
        tokens.push(new Token(TokenType.STAR, '*', startLine, startCol));
      } else if (ch === '/' && this.peek(1) === '=') {
        this.advance(); this.advance();
        tokens.push(new Token(TokenType.SLASH_ASSIGN, '/=', startLine, startCol));
      } else if (ch === '/') {
        this.advance();
        tokens.push(new Token(TokenType.SLASH, '/', startLine, startCol));
      } else if (ch === '%') {
        this.advance();
        tokens.push(new Token(TokenType.PERCENT, '%', startLine, startCol));
      } else {
        throw new Error(`Unexpected character '${ch}' at line ${startLine}:${startCol}`);
      }
    }

    tokens.push(new Token(TokenType.EOF, null, this.line, this.col));
    return tokens;
  }
}
