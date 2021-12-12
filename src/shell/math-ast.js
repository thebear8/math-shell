import { AstNode } from "./math-runtime";

export class Constant extends AstNode {
    constructor(value) {
        super();
        this.value = value;
    }

    evaluate(ctx) {
        return Number.parseFloat(this.value);
    }

    describe(ctx) {
        return this.value;
    }
};

export class Identifier extends AstNode {
    constructor(name) {
        super();
        this.name = name;
    }

    evaluate(ctx) {
        return ctx.evaluate(this.name);
    }

    describe(ctx) {
        return this.name;
    }
};

export class GroupExpression extends AstNode {
    constructor(expression) {
        super();
        this.expression = expression;
    }

    evaluate(ctx) {
        return ctx.evaluate(this.expression);
    }

    describe(ctx) {
        return "(" + ctx.describe(this.expression) + ")";
    }
};

export class FunctionCall extends AstNode {
    constructor(name, parameters) {
        super();
        this.name = name;
        this.parameters = parameters;
    }

    evaluate(ctx) {
        return ctx.call(this.name, ...this.parameters);
    }

    describe(ctx) {
        return this.name + "(" + this.parameters.map((p) => ctx.describe(p)).join(", ") + ")";
    }
};

////////////////////////////////////////////////////////////////

export class Positive extends AstNode {
    constructor(expression) {
        super();
        this.expression = expression;
    }

    evaluate(ctx) {
        return +ctx.evaluate(this.expression);
    }

    describe(ctx) {
        return "+(" + ctx.describe(this.expression) + ")";
    }
};

export class Negative extends AstNode {
    constructor(expression) {
        super();
        this.expression = expression;
    }

    evaluate(ctx) {
        return -ctx.evaluate(this.expression);
    }

    describe(ctx) {
        return "-(" + ctx.describe(this.expression) + ")";
    }
};

////////////////////////////////////////////////////////////////

export class Exponentiate extends AstNode {
    constructor(left, right) {
        super();
        this.left = left;
        this.right = right;
    }

    evaluate(ctx) {
        return Math.pow(ctx.evaluate(this.left), ctx.evaluate(this.right));
    }

    describe(ctx) {
        return ctx.describe(this.left) + " ^ " + ctx.describe(this.right);
    }
};

export class Multiply extends AstNode {
    constructor(left, right) {
        super();
        this.left = left;
        this.right = right;
    }

    evaluate(ctx) {
        return ctx.evaluate(this.left) * ctx.evaluate(this.right);
    }

    describe(ctx) {
        return ctx.describe(this.left) + " * " + ctx.describe(this.right);
    }
};

export class Divide extends AstNode {
    constructor(left, right) {
        super();
        this.left = left;
        this.right = right;
    }

    evaluate(ctx) {
        return ctx.evaluate(this.left) / ctx.evaluate(this.right);
    }

    describe(ctx) {
        return ctx.describe(this.left) + " / " + ctx.describe(this.right);
    }
};

export class Add extends AstNode {
    constructor(left, right) {
        super();
        this.left = left;
        this.right = right;
    }

    evaluate(ctx) {
        return ctx.evaluate(this.left) + ctx.evaluate(this.right);
    }

    describe(ctx) {
        return ctx.describe(this.left) + " + " + ctx.describe(this.right);
    }
};

export class Subtract extends AstNode {
    constructor(left, right) {
        super();
        this.left = left;
        this.right = right;
    }

    evaluate(ctx) {
        return ctx.evaluate(this.left) - ctx.evaluate(this.right);
    }

    describe(ctx) {
        return ctx.describe(this.left) + " - " + ctx.describe(this.right);
    }
};

////////////////////////////////////////////////////////////////

export class AssignmentStatement extends AstNode {
    constructor(name, expression) {
        super();
        this.name = name;
        this.expression = expression;
    }

    evaluate(ctx) {
        return ctx.setVariable(this.name, ctx.evaluate(this.expression));
    }

    describe(ctx) {
        return this.name + " = " + ctx.describe(this.expression);
    }
};

export class FunctionDefinitionStatement extends AstNode {
    constructor(name, parameters, expression) {
        super();
        this.name = name;
        this.parameters = parameters;
        this.expression = expression;
    }

    evaluate(ctx) {
        return ctx.setFunction(this.name, this);
    }

    call(ctx, ...args) {
        ctx.beginScope();
        this.parameters.forEach((p, i) => {
            ctx.setVariable(p, args[i] ?? 0);
        });
        let value = ctx.evaluate(this.expression);
        ctx.endScope();
        return value;
    }

    describe(ctx) {
        return this.name + "(" + this.parameters.join(", ") + ") = " + ctx.describe(this.expression);
    }
};