export class AstNode {
    constructor() {
        this.type = this.constructor.name;
    }

    execute(ctx, console) {
        throw new Error("Not Implemented");
    }

    evaluate(ctx) {
        throw new Error("Not Implemented");
    }

    call(ctx, ...parameters) {
        throw new Error("Not Implemented");
    }

    describe(ctx) {
        throw new Error("Not Implemented");
    }
};

export class Context {
    variables = {};
    functions = {};
    scopes = [];

    constructor() {
        this.reset();
    }

    reset() {
        let mathValues = Object.getOwnPropertyNames(Math).map((n) => [n, Math[n]]);
        this.variables = Object.fromEntries(mathValues.filter(([n, v]) => typeof(v) == "number"));
        this.functions = Object.fromEntries(mathValues.filter(([n, v]) => typeof(v) == "function"));
        this.scopes = [];
    }

    setVariable(name, value) {
        return this.variables[name] = value;
    }

    setFunction(name, value) {
        return this.functions[name] = value;
    }

    beginScope() {
        this.scopes.push([this.variables, this.functions]);
    }

    endScope() {
        [this.variables, this.functions] = this.scopes.pop();
    }

    execute(console, value) {

    }

    evaluate(value) {
        if(typeof(value) == "number") {
            return value;
        } else if(value instanceof AstNode) {
            return value.evaluate(this);
        } else if(value in this.variables) {
            return this.evaluate(this.variables[value]);
        } else {
            throw new Error("Undefined Value");
        }
    }

    call(value, ...parameters) {
        if(typeof(value) == "function") {
            return value(...parameters.map((p) => this.evaluate(p)));
        } else if(value instanceof AstNode) {
            return value.call(this, ...parameters.map((p) => this.evaluate(p)));
        } else if(value in this.functions) {
            return this.call(this.functions[value], ...parameters);
        } else {
            throw new Error("Undefined Function");
        }
    }

    describe(value) {
        if(typeof(value) == "number") {
            return value.toString();
        } else if(typeof(value) == "function") {
            return value.toString();
        } else if(value instanceof AstNode) {
            return value.describe(this);
        } else if(value in this.variables) {
            return this.describe(this.variables[value]);
        } else if(value in this.functions) {
            return this.describe(this.functions[value]);
        } else if(typeof(value) == "string") {
            return value;
        } else {
            throw new Error("Undefined Object");
        }
    }
};