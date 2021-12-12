import * as Ast from "./math-ast.js";
import { Any, AstNode, EOF, Group, Whitespace, Optional, Reduce, Regex, Repetition, Y } from "../parser.js/parser.js";

function __unaryPre(...stack) {
    let e = stack.pop();
    while(stack.length) {
        let operator = stack.pop();
        e = new operator(e);
    }
    return e;
};

function __binaryLeft(...stack) {
    let left = stack.shift();
    while(stack.length) {
        let operator = stack.shift();
        let right = stack.shift();
        left = new operator(left, right);
    }
    return left;
};

function __binaryRight(...stack) {
    let right = stack.pop();
    while(stack.length) {
        let operator = stack.pop();
        let left = stack.pop();
        right = new operator(left, right);
    }
    return right;
};

const ConstantToken = Regex(/([0-9]+(\.[0-9]+)?)/);
const Constant = AstNode(Ast.Constant, ConstantToken);
const IdentifierToken = Regex(/([_a-zA-Z][_a-zA-Z0-9]*)/);
const Identifier = AstNode(Ast.Identifier, IdentifierToken);

const Expression = Y((Expression) => {
    const GroupExpression = AstNode(Ast.GroupExpression, "(", Expression, ")");
    const FunctionCall = AstNode(Ast.FunctionCall, IdentifierToken, "(", Group(Optional(Expression, Repetition(",", Expression))), ")");
    const L0 = Any(FunctionCall, GroupExpression, Identifier, Constant);

    const Exponentiate = Reduce((e) => [Ast.Exponentiate, e], "^", L0);
    const L1 = Reduce(__binaryRight, L0, Repetition(Exponentiate));

    const ImplicitMultiplication = Reduce((e) => [Ast.Multiply, e], L1);
    const L2 = Reduce(__binaryLeft, L1, Repetition(ImplicitMultiplication));

    const Positive = Reduce(() => Ast.Positive, "+");
    const Negative = Reduce(() => Ast.Negative, "-");
    const L3 = Reduce(__unaryPre, Repetition(Any(Positive, Negative)), L2);

    const Multiply = Reduce((e) => [Ast.Multiply, e], "*", L3);
    const Divide = Reduce((e) => [Ast.Divide, e], "/", L3);
    const L4 = Reduce(__binaryLeft, L3, Repetition(Any(Multiply, Divide)));

    const Add = Reduce((e) => [Ast.Add, e], "+", L4);
    const Subtract = Reduce((e) => [Ast.Subtract, e], "-", L4);
    const L5 = Reduce(__binaryLeft, L4, Repetition(Any(Add, Subtract)));

    return L5;
});

const AssignmentStatement = AstNode(Ast.AssignmentStatement, IdentifierToken, "=", Expression);
const FunctionDefinitionStatement = AstNode(Ast.FunctionDefinitionStatement, IdentifierToken, "(", Group(Optional(IdentifierToken, Repetition(",", IdentifierToken))), ")", "=", Expression);
const Statement = Any(AssignmentStatement, FunctionDefinitionStatement, Expression);

export const parseMath = Whitespace(/\s+/, Statement, EOF());