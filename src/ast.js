// WAZOBIA Abstract Syntax Tree (AST) Nodes

export class Program {
  constructor(body) {
    this.type = 'Program';
    this.body = body;
  }
}

export class VarDecl {
  constructor(name, initializer, isConst = false) {
    this.type = 'VarDecl';
    this.name = name;
    this.initializer = initializer;
    this.isConst = isConst;
  }
}

export class Assignment {
  constructor(target, operator, value) {
    this.type = 'Assignment';
    this.target = target;
    this.operator = operator;
    this.value = value;
  }
}

export class ForRange {
  constructor(variable, start, end, body) {
    this.type = 'ForRange';
    this.variable = variable;
    this.start = start;
    this.end = end;
    this.body = body;
  }
}

export class ForIn {
  constructor(variable, iterable, body) {
    this.type = 'ForIn';
    this.variable = variable;
    this.iterable = iterable;
    this.body = body;
  }
}

export class ForCStyle {
  constructor(init, test, update, body) {
    this.type = 'ForCStyle';
    this.init = init;
    this.test = test;
    this.update = update;
    this.body = body;
  }
}

export class WhileStatement {
  constructor(condition, body) {
    this.type = 'WhileStatement';
    this.condition = condition;
    this.body = body;
  }
}

export class IfStatement {
  constructor(condition, consequent, alternates = [], fallback = null) {
    this.type = 'IfStatement';
    this.condition = condition;
    this.consequent = consequent;
    this.alternates = alternates; // array of { condition, body }
    this.fallback = fallback;     // block
  }
}

export class Block {
  constructor(statements) {
    this.type = 'Block';
    this.statements = statements;
  }
}

export class FunctionDecl {
  constructor(name, params, body, isAsync = false) {
    this.type = 'FunctionDecl';
    this.name = name;
    this.params = params;
    this.body = body;
    this.isAsync = isAsync;
  }
}

export class ReturnStatement {
  constructor(argument) {
    this.type = 'ReturnStatement';
    this.argument = argument;
  }
}

export class ClassDecl {
  constructor(name, methods = {}) {
    this.type = 'ClassDecl';
    this.name = name;
    this.methods = methods;
  }
}

export class NewExpression {
  constructor(callee, args) {
    this.type = 'NewExpression';
    this.callee = callee;
    this.args = args;
  }
}

export class TryCatchStatement {
  constructor(tryBlock, catchParam, catchBlock, finallyBlock = null) {
    this.type = 'TryCatchStatement';
    this.tryBlock = tryBlock;
    this.catchParam = catchParam;
    this.catchBlock = catchBlock;
    this.finallyBlock = finallyBlock;
  }
}

export class ImportStatement {
  constructor(source, isInterop = null, alias = null, specifiers = []) {
    this.type = 'ImportStatement';
    this.source = source;
    this.isInterop = isInterop; // 'js' | 'py' | null
    this.alias = alias;
    this.specifiers = specifiers;
  }
}

export class ExportStatement {
  constructor(declaration) {
    this.type = 'ExportStatement';
    this.declaration = declaration;
  }
}

export class PrintStatement {
  constructor(args) {
    this.type = 'PrintStatement';
    this.args = args;
  }
}

export class BinaryExpr {
  constructor(left, operator, right) {
    this.type = 'BinaryExpr';
    this.left = left;
    this.operator = operator;
    this.right = right;
  }
}

export class LogicalExpr {
  constructor(left, operator, right) {
    this.type = 'LogicalExpr';
    this.left = left;
    this.operator = operator; // 'and' | 'or'
    this.right = right;
  }
}

export class UnaryExpr {
  constructor(operator, argument) {
    this.type = 'UnaryExpr';
    this.operator = operator;
    this.argument = argument;
  }
}

export class CallExpr {
  constructor(callee, args) {
    this.type = 'CallExpr';
    this.callee = callee;
    this.args = args;
  }
}

export class MemberExpr {
  constructor(object, property, computed = false) {
    this.type = 'MemberExpr';
    this.object = object;
    this.property = property;
    this.computed = computed;
  }
}

export class AwaitExpr {
  constructor(argument) {
    this.type = 'AwaitExpr';
    this.argument = argument;
  }
}

export class Literal {
  constructor(value, raw) {
    this.type = 'Literal';
    this.value = value;
    this.raw = raw;
  }
}

export class Identifier {
  constructor(name) {
    this.type = 'Identifier';
    this.name = name;
  }
}

export class ListLiteral {
  constructor(elements) {
    this.type = 'ListLiteral';
    this.elements = elements;
  }
}

export class ObjectLiteral {
  constructor(properties) {
    this.type = 'ObjectLiteral';
    this.properties = properties; // array of { key, value }
  }
}
