import { Add, Assignment, CallExpression, ConstantExpression, Divide, Exponentiate, FunctionDefinition, GroupExpression, Multiply, Negative, Positive, Subtract, VariableExpression } from "./math-ast";

function throwIf(condition, message) {
    if(condition) {
        console.log(`Runtime Error: ${message}`);
        throw new Error(`Runtime Error: ${message}`);
    }
}

export class MathContext {
    values = {};

    constructor() {
        Object.getOwnPropertyNames(Math).forEach((name) => {
            if(typeof(Math[name]) == "function") {
                this.values[name] = (ctx, args) => Math[name](...args.map((a) => ctx.evaluate(a)));
            }
        });
    }

    evaluate(node) {
        if(node instanceof ConstantExpression) {
            return Number.parseFloat(node.value);
        } else if(node instanceof VariableExpression) {
            throwIf(!(node.name in this.values), `${node.name} is not defined`);
            return this.values[node.name];
        } else if(node instanceof GroupExpression) {
            return this.evaluate(node.expression);
        } else if(node instanceof CallExpression) {
            throwIf(!(node.name in this.values), `${node.name} is not defined`);
            if(typeof(this.values[node.name]) == "function") {
                return this.values[node.name](this, node.args);
            } else if(this.values[node.name] instanceof FunctionDefinition) {
                let parameters = this.values[node.name].parameters;
                let expression = this.values[node.name].expression;
                let scope = this.values;
                this.values = Object.fromEntries([...Object.entries(this.values), ...parameters.map((k, i) => [k, this.evaluate(node.args[i])])]);
                let result = this.evaluate(expression);
                this.values = scope;
                return result;
            } else {
                throwIf(true, `${node.name} is not a function`);
            }
        } else if(node instanceof Positive) {
            return +this.evaluate(node.expression);
        } else if(node instanceof Negative) {
            return -this.evaluate(node.expression);
        } else if(node instanceof Exponentiate) {
            return this.evaluate(node.left) ** this.evaluate(node.right);
        } else if(node instanceof Multiply) {
            return this.evaluate(node.left) * this.evaluate(node.right);
        } else if(node instanceof Divide) {
            return this.evaluate(node.left) / this.evaluate(node.right);
        } else if(node instanceof Add) {
            return this.evaluate(node.left) + this.evaluate(node.right);
        } else if(node instanceof Subtract) {
            return this.evaluate(node.left) - this.evaluate(node.right);
        } else if(node instanceof Assignment) {
            return (this.values[node.name] = this.evaluate(node.expression));
        } else if(node instanceof FunctionDefinition) {
            return (this.values[node.name] = node);
        }
    }

    describe(node) {
        if(typeof(node) == "number") {
            return node.toString();
        } else if(node instanceof ConstantExpression) {
            return node.value;
        } else if(node instanceof VariableExpression) {
            return node.name;
        } else if(node instanceof GroupExpression) {
            return `(${this.describe(node.expression)})`;
        } else if(node instanceof CallExpression) {
            return `${node.name}(${node.args.map((a) => this.describe(a)).join(", ")})`;
        } else if(node instanceof Positive) {
            return `+${this.describe(node.expression)}`;
        } else if(node instanceof Negative) {
            return `-${this.describe(node.expression)}`;
        } else if(node instanceof Exponentiate) {
            return `${this.describe(node.left)} ^ ${this.describe(node.right)}`;
        } else if(node instanceof Multiply) {
            return `${this.describe(node.left)} * ${this.describe(node.right)}`;
        } else if(node instanceof Divide) {
            return `${this.describe(node.left)} / ${this.describe(node.right)}`;
        } else if(node instanceof Add) {
            return `${this.describe(node.left)} + ${this.describe(node.right)}`;
        } else if(node instanceof Subtract) {
            return `${this.describe(node.left)} - ${this.describe(node.right)}`;
        } else if(node instanceof Assignment) {
            return `${this.describe(node.name)} = ${this.describe(node.expression)}`;
        } else if(node instanceof FunctionDefinition) {
            return `${node.name}(${node.parameters.join(", ")}) = ${this.describe(node.expression)}`;
        }
    }
};