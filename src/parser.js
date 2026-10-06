// WAZOBIA Recursive Descent Parser
import { TokenType } from './lexer.js';
import * as AST from './ast.js';

export class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.current = 0;
  }

  peek(offset = 0) {
    const idx = this.current + offset;
    return idx < this.tokens.length ? this.tokens[idx] : this.tokens[this.tokens.length - 1];
  }

  isAtEnd() {
    return this.peek().type === TokenType.EOF;
  }

  advance() {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  previous() {
    return this.tokens[this.current - 1];
  }

  check(type) {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  match(...types) {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  consume(type, message) {
    if (this.check(type)) return this.advance();
    const token = this.peek();
    throw new Error(`Parse Error [Line ${token.line}:${token.col}]: ${message}. Got '${token.raw || token.type}'.`);
  }

  parse() {
    const statements = [];
    while (!this.isAtEnd()) {
      // Consume unnecessary semicolons
      if (this.match(TokenType.SEMICOLON)) continue;
      statements.push(this.statement());
    }
    return new AST.Program(statements);
  }

  statement() {
    if (this.match(TokenType.KW_LET)) return this.varDeclaration(false);
    if (this.match(TokenType.KW_CONST)) return this.varDeclaration(true);
    if (this.match(TokenType.KW_FN)) return this.functionDeclaration(false);
    if (this.check(TokenType.KW_ASYNC) && this.peek(1).type === TokenType.KW_FN) {
      this.advance(); // consume async
      this.advance(); // consume fn
      return this.functionDeclaration(true);
    }
    if (this.match(TokenType.KW_CLASS)) return this.classDeclaration();
    if (this.match(TokenType.KW_FOR)) return this.forStatement();
    if (this.match(TokenType.KW_WHILE)) return this.whileStatement();
    if (this.match(TokenType.KW_IF)) return this.ifStatement();
    if (this.match(TokenType.KW_TRY)) return this.tryCatchStatement();
    if (this.match(TokenType.KW_RETURN)) return this.returnStatement();
    if (this.match(TokenType.KW_IMPORT)) return this.importStatement();
    if (this.match(TokenType.KW_EXPORT)) return this.exportStatement();
    if (this.match(TokenType.KW_PRINT)) return this.printStatement();
    if (this.check(TokenType.LBRACE)) return this.block();

    return this.expressionStatement();
  }

  varDeclaration(isConst) {
    const nameToken = this.consume(TokenType.IDENTIFIER, 'Expected variable name');
    let initializer = null;
    if (this.match(TokenType.ASSIGN)) {
      initializer = this.expression();
    }
    this.match(TokenType.SEMICOLON);
    return new AST.VarDecl(nameToken.value, initializer, isConst);
  }

  functionDeclaration(isAsync) {
    const nameToken = this.consume(TokenType.IDENTIFIER, 'Expected function name');
    this.consume(TokenType.LPAREN, "Expected '(' after function name");
    const params = [];
    if (!this.check(TokenType.RPAREN)) {
      do {
        const param = this.consume(TokenType.IDENTIFIER, 'Expected parameter name');
        params.push(param.value);
      } while (this.match(TokenType.COMMA));
    }
    this.consume(TokenType.RPAREN, "Expected ')' after parameter list");
    const body = this.block();
    return new AST.FunctionDecl(nameToken.value, params, body, isAsync);
  }

  classDeclaration() {
    const nameToken = this.consume(TokenType.IDENTIFIER, 'Expected class name');
    this.consume(TokenType.LBRACE, "Expected '{' before class body");
    const methods = {};
    while (!this.check(TokenType.RBRACE) && !this.isAtEnd()) {
      if (this.match(TokenType.SEMICOLON)) continue;
      let isAsync = false;
      if (this.match(TokenType.KW_ASYNC)) isAsync = true;
      if (this.match(TokenType.KW_FN)) {
        // fn keyword is optional in class body
      }
      const methodName = this.consume(TokenType.IDENTIFIER, 'Expected method name');
      this.consume(TokenType.LPAREN, "Expected '(' after method name");
      const params = [];
      if (!this.check(TokenType.RPAREN)) {
        do {
          const param = this.consume(TokenType.IDENTIFIER, 'Expected parameter name');
          params.push(param.value);
        } while (this.match(TokenType.COMMA));
      }
      this.consume(TokenType.RPAREN, "Expected ')' after method parameters");
      const body = this.block();
      methods[methodName.value] = new AST.FunctionDecl(methodName.value, params, body, isAsync);
    }
    this.consume(TokenType.RBRACE, "Expected '}' after class body");
    return new AST.ClassDecl(nameToken.value, methods);
  }

  forStatement() {
    // 1. C-style: for (let i = 0; i < 10; i = i + 1)
    if (this.check(TokenType.LPAREN)) {
      this.advance();
      let init = null;
      if (this.match(TokenType.KW_LET)) {
        init = this.varDeclaration(false);
      } else if (!this.check(TokenType.SEMICOLON)) {
        init = this.expression();
        this.consume(TokenType.SEMICOLON, "Expected ';' after loop initializer");
      } else {
        this.consume(TokenType.SEMICOLON, "Expected ';' after loop initializer");
      }

      let test = null;
      if (!this.check(TokenType.SEMICOLON)) {
        test = this.expression();
      }
      this.consume(TokenType.SEMICOLON, "Expected ';' after loop condition");

      let update = null;
      if (!this.check(TokenType.RPAREN)) {
        update = this.expression();
      }
      this.consume(TokenType.RPAREN, "Expected ')' after for clauses");
      const body = this.block();
      return new AST.ForCStyle(init, test, update, body);
    }

    // 2. Range or Collection: for var in iterable or for var in 1..10
    const varToken = this.consume(TokenType.IDENTIFIER, "Expected loop variable name after 'for'");
    this.consume(TokenType.KW_IN, "Expected 'in' (or localized keyword 'ninu'/'cikin'/'nime') after loop variable");

    const startOrIterable = this.expression();

    // Check if it's a range: e.g. 1..10
    if (startOrIterable.type === 'BinaryExpr' && startOrIterable.operator === '..') {
      const body = this.block();
      return new AST.ForRange(varToken.value, startOrIterable.left, startOrIterable.right, body);
    }

    const body = this.block();
    return new AST.ForIn(varToken.value, startOrIterable, body);
  }

  whileStatement() {
    const hasParen = this.match(TokenType.LPAREN);
    const condition = this.expression();
    if (hasParen) this.consume(TokenType.RPAREN, "Expected ')' after condition");
    const body = this.block();
    return new AST.WhileStatement(condition, body);
  }

  ifStatement() {
    const hasParen = this.match(TokenType.LPAREN);
    const condition = this.expression();
    if (hasParen) this.consume(TokenType.RPAREN, "Expected ')' after condition");
    const consequent = this.block();

    const alternates = [];
    while (this.match(TokenType.KW_ELIF)) {
      const elifParen = this.match(TokenType.LPAREN);
      const elifCond = this.expression();
      if (elifParen) this.consume(TokenType.RPAREN, "Expected ')' after elif condition");
      const elifBody = this.block();
      alternates.push({ condition: elifCond, body: elifBody });
    }

    let fallback = null;
    if (this.match(TokenType.KW_ELSE)) {
      fallback = this.block();
    }

    return new AST.IfStatement(condition, consequent, alternates, fallback);
  }

  tryCatchStatement() {
    const tryBlock = this.block();
    this.consume(TokenType.KW_CATCH, "Expected 'catch' (or localized keyword) after try block");
    
    let catchParam = 'error';
    if (this.match(TokenType.LPAREN)) {
      catchParam = this.consume(TokenType.IDENTIFIER, 'Expected error variable name in catch').value;
      this.consume(TokenType.RPAREN, "Expected ')' after catch parameter");
    }
    const catchBlock = this.block();

    let finallyBlock = null;
    if (this.match(TokenType.KW_FINALLY)) {
      finallyBlock = this.block();
    }

    return new AST.TryCatchStatement(tryBlock, catchParam, catchBlock, finallyBlock);
  }

  returnStatement() {
    let arg = null;
    if (!this.check(TokenType.SEMICOLON) && !this.check(TokenType.RBRACE) && !this.isAtEnd()) {
      arg = this.expression();
    }
    this.match(TokenType.SEMICOLON);
    return new AST.ReturnStatement(arg);
  }

  importStatement() {
    // Check if interop import: import js "fs" as fs OR import py "math" as math
    if (this.match(TokenType.KW_JS)) {
      const srcToken = this.consume(TokenType.STRING, 'Expected JavaScript module string');
      let alias = null;
      if (this.match(TokenType.KW_AS)) {
        alias = this.consume(TokenType.IDENTIFIER, 'Expected alias identifier').value;
      }
      this.match(TokenType.SEMICOLON);
      return new AST.ImportStatement(srcToken.value, 'js', alias);
    }

    if (this.match(TokenType.KW_PY)) {
      const srcToken = this.consume(TokenType.STRING, 'Expected Python module string');
      let alias = null;
      if (this.match(TokenType.KW_AS)) {
        alias = this.consume(TokenType.IDENTIFIER, 'Expected alias identifier').value;
      }
      this.match(TokenType.SEMICOLON);
      return new AST.ImportStatement(srcToken.value, 'py', alias);
    }

    // Standard module import: import { a, b } from "file.wz"
    let specifiers = [];
    if (this.match(TokenType.LBRACE)) {
      do {
        const spec = this.consume(TokenType.IDENTIFIER, 'Expected imported name');
        specifiers.push(spec.value);
      } while (this.match(TokenType.COMMA));
      this.consume(TokenType.RBRACE, "Expected '}' after import specifiers");
    }

    this.consume(TokenType.KW_FROM, "Expected 'from' after import specifiers");
    const pathToken = this.consume(TokenType.STRING, 'Expected module path string');
    this.match(TokenType.SEMICOLON);
    return new AST.ImportStatement(pathToken.value, null, null, specifiers);
  }

  exportStatement() {
    if (this.match(TokenType.KW_FN)) {
      const fn = this.functionDeclaration(false);
      return new AST.ExportStatement(fn);
    }
    if (this.match(TokenType.KW_LET)) {
      const v = this.varDeclaration(false);
      return new AST.ExportStatement(v);
    }
    if (this.match(TokenType.KW_CONST)) {
      const v = this.varDeclaration(true);
      return new AST.ExportStatement(v);
    }
    throw new Error('Expected function or variable declaration after export');
  }

  printStatement() {
    this.consume(TokenType.LPAREN, "Expected '(' after print");
    const args = [];
    if (!this.check(TokenType.RPAREN)) {
      do {
        args.push(this.expression());
      } while (this.match(TokenType.COMMA));
    }
    this.consume(TokenType.RPAREN, "Expected ')' after print arguments");
    this.match(TokenType.SEMICOLON);
    return new AST.PrintStatement(args);
  }

  block() {
    this.consume(TokenType.LBRACE, "Expected '{' to start block");
    const statements = [];
    while (!this.check(TokenType.RBRACE) && !this.isAtEnd()) {
      if (this.match(TokenType.SEMICOLON)) continue;
      statements.push(this.statement());
    }
    this.consume(TokenType.RBRACE, "Expected '}' to end block");
    return new AST.Block(statements);
  }

  expressionStatement() {
    const expr = this.expression();
    this.match(TokenType.SEMICOLON);
    return expr;
  }

  expression() {
    return this.assignment();
  }

  assignment() {
    const expr = this.logicalOr();

    if (this.match(TokenType.ASSIGN, TokenType.PLUS_ASSIGN, TokenType.MINUS_ASSIGN, TokenType.STAR_ASSIGN, TokenType.SLASH_ASSIGN)) {
      const op = this.previous().type;
      const value = this.assignment(); // right-associative

      if (expr.type === 'Identifier' || expr.type === 'MemberExpr') {
        return new AST.Assignment(expr, op, value);
      }
      throw new Error('Invalid assignment target');
    }

    return expr;
  }

  // Logical OR (English: 'or', Yoruba: 'tabi', Hausa: 'ko', Igbo: 'maobu')
  logicalOr() {
    let expr = this.logicalAnd();

    while (this.match(TokenType.KW_OR)) {
      const right = this.logicalAnd();
      expr = new AST.LogicalExpr(expr, 'or', right);
    }

    return expr;
  }

  // Logical AND (English: 'and', Yoruba: 'ati', Hausa: 'da', Igbo: 'na')
  logicalAnd() {
    let expr = this.equality();

    while (this.match(TokenType.KW_AND)) {
      const right = this.equality();
      expr = new AST.LogicalExpr(expr, 'and', right);
    }

    return expr;
  }

  equality() {
    let expr = this.comparison();

    while (this.match(TokenType.EQUAL, TokenType.NOT_EQUAL)) {
      const op = this.previous().type;
      const right = this.comparison();
      expr = new AST.BinaryExpr(expr, op, right);
    }

    return expr;
  }

  comparison() {
    let expr = this.range();

    while (this.match(TokenType.LT, TokenType.LTE, TokenType.GT, TokenType.GTE)) {
      const op = this.previous().type;
      const right = this.range();
      expr = new AST.BinaryExpr(expr, op, right);
    }

    return expr;
  }

  range() {
    let expr = this.additive();

    while (this.match(TokenType.DOT_DOT)) {
      const right = this.additive();
      expr = new AST.BinaryExpr(expr, '..', right);
    }

    return expr;
  }

  additive() {
    let expr = this.multiplicative();

    while (this.match(TokenType.PLUS, TokenType.MINUS)) {
      const op = this.previous().type;
      const right = this.multiplicative();
      expr = new AST.BinaryExpr(expr, op, right);
    }

    return expr;
  }

  multiplicative() {
    let expr = this.exponent();

    while (this.match(TokenType.STAR, TokenType.SLASH, TokenType.PERCENT)) {
      const op = this.previous().type;
      const right = this.exponent();
      expr = new AST.BinaryExpr(expr, op, right);
    }

    return expr;
  }

  exponent() {
    let expr = this.unary();

    while (this.match(TokenType.POWER)) {
      const right = this.unary();
      expr = new AST.BinaryExpr(expr, '**', right);
    }

    return expr;
  }

  // Unary NOT (English: 'not', Yoruba: 'ko', Hausa: 'ba', Igbo: 'abughi') and - / +
  unary() {
    if (this.match(TokenType.KW_NOT)) {
      const right = this.unary();
      return new AST.UnaryExpr('not', right);
    }
    if (this.match(TokenType.MINUS)) {
      const right = this.unary();
      return new AST.UnaryExpr('-', right);
    }
    if (this.match(TokenType.PLUS)) {
      const right = this.unary();
      return new AST.UnaryExpr('+', right);
    }
    if (this.match(TokenType.KW_AWAIT)) {
      const right = this.unary();
      return new AST.AwaitExpr(right);
    }

    return this.callOrMember();
  }

  callOrMember() {
    let expr = this.primary();

    while (true) {
      if (this.match(TokenType.LPAREN)) {
        // Function call
        const args = [];
        if (!this.check(TokenType.RPAREN)) {
          do {
            args.push(this.expression());
          } while (this.match(TokenType.COMMA));
        }
        this.consume(TokenType.RPAREN, "Expected ')' after arguments");
        expr = new AST.CallExpr(expr, args);
      } else if (this.match(TokenType.DOT)) {
        // Property access: obj.field (allow identifiers or keywords like py.import)
        const nextToken = this.advance();
        if (nextToken.type === TokenType.IDENTIFIER || nextToken.type.startsWith('KW_')) {
          expr = new AST.MemberExpr(expr, nextToken.raw || nextToken.value, false);
        } else {
          throw new Error('Expected property name after .');
        }
      } else if (this.match(TokenType.LBRACKET)) {
        // Computed indexing: arr[index] or obj[prop]
        const prop = this.expression();
        this.consume(TokenType.RBRACKET, "Expected ']' after index");
        expr = new AST.MemberExpr(expr, prop, true);
      } else {
        break;
      }
    }

    return expr;
  }

  primary() {
    if (this.match(TokenType.KW_TRUE)) return new AST.Literal(true, 'true');
    if (this.match(TokenType.KW_FALSE)) return new AST.Literal(false, 'false');
    if (this.match(TokenType.KW_NULL)) return new AST.Literal(null, 'null');

    if (this.match(TokenType.NUMBER)) {
      return new AST.Literal(this.previous().value, this.previous().raw);
    }
    if (this.match(TokenType.STRING)) {
      return new AST.Literal(this.previous().value, this.previous().raw);
    }

    if (this.match(TokenType.KW_THIS)) {
      return new AST.Identifier('this');
    }

    if (this.match(TokenType.KW_JS)) {
      return new AST.Identifier('js');
    }

    if (this.match(TokenType.KW_PY)) {
      return new AST.Identifier('py');
    }

    if (this.match(TokenType.KW_NEW)) {
      const className = this.consume(TokenType.IDENTIFIER, 'Expected class name after new').value;
      this.consume(TokenType.LPAREN, "Expected '(' after class name");
      const args = [];
      if (!this.check(TokenType.RPAREN)) {
        do {
          args.push(this.expression());
        } while (this.match(TokenType.COMMA));
      }
      this.consume(TokenType.RPAREN, "Expected ')' after constructor arguments");
      return new AST.NewExpression(className, args);
    }

    if (this.match(TokenType.IDENTIFIER)) {
      return new AST.Identifier(this.previous().value);
    }

    // List Literal: [1, 2, 3]
    if (this.match(TokenType.LBRACKET)) {
      const elements = [];
      if (!this.check(TokenType.RBRACKET)) {
        do {
          elements.push(this.expression());
        } while (this.match(TokenType.COMMA));
      }
      this.consume(TokenType.RBRACKET, "Expected ']' after list elements");
      return new AST.ListLiteral(elements);
    }

    // Object Literal: { key: value, ... }
    if (this.match(TokenType.LBRACE)) {
      const properties = [];
      if (!this.check(TokenType.RBRACE)) {
        do {
          let key;
          if (this.match(TokenType.IDENTIFIER)) {
            key = this.previous().value;
          } else if (this.match(TokenType.STRING)) {
            key = this.previous().value;
          } else {
            throw new Error('Expected identifier or string as object key');
          }
          this.consume(TokenType.COLON, "Expected ':' after object key");
          const val = this.expression();
          properties.push({ key, value: val });
        } while (this.match(TokenType.COMMA));
      }
      this.consume(TokenType.RBRACE, "Expected '}' after object properties");
      return new AST.ObjectLiteral(properties);
    }

    // Grouping: ( expr )
    if (this.match(TokenType.LPAREN)) {
      const expr = this.expression();
      this.consume(TokenType.RPAREN, "Expected ')' after grouping expression");
      return expr;
    }

    const token = this.peek();
    throw new Error(`Unexpected token '${token.raw || token.type}' at line ${token.line}:${token.col}`);
  }
}
