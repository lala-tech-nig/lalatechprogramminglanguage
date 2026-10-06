// WAZOBIA Dialect Translator & Transpiler
// Translates Wazobia source code between English, Yoruba, Hausa, and Igbo dialects
import { Lexer, TokenType } from './lexer.js';
import { PRIMARY_DIALECT_KEYWORD } from './dictionary.js';

export function translateSource(source, targetDialect = 'en') {
  const lexer = new Lexer(source);
  const tokens = lexer.tokenize();

  const dialectMap = PRIMARY_DIALECT_KEYWORD[targetDialect] || PRIMARY_DIALECT_KEYWORD.en;

  let output = '';
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t.type === TokenType.EOF) break;

    // If it's a canonical keyword token, map to target dialect's primary keyword
    if (t.type.startsWith('KW_')) {
      const canonicalKey = t.type.substring(3); // e.g. 'FOR', 'AND', 'LET'
      const translated = dialectMap[canonicalKey] || t.raw;
      output += translated + ' ';
    } else if (t.type === TokenType.STRING) {
      output += t.raw + ' ';
    } else if (t.type === TokenType.SEMICOLON) {
      output += ';\n';
    } else if (t.type === TokenType.LBRACE) {
      output += '{\n  ';
    } else if (t.type === TokenType.RBRACE) {
      output += '\n}\n';
    } else {
      output += (t.raw || t.value) + ' ';
    }
  }

  return output.trim();
}
