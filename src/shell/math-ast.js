export class ConstantExpression {
    constructor(value) {
        this.value = value;
    }
};

export class VariableExpression {
    constructor(name) {
        this.name = name;
    }
};

export class GroupExpression {
    constructor(expression) {
        this.expression = expression;
    }
};

export class CallExpression {
    constructor(name, args) {
        this.name = name;
        this.args = args;
    }
};

////////////////////////////////////////////////////////////////

export class Positive {
    constructor(expression) {
        this.expression = expression;
    }
};

export class Negative {
    constructor(expression) {
        this.expression = expression;
    }
};

////////////////////////////////////////////////////////////////

export class Exponentiate {
    constructor(left, right) {
        this.left = left;
        this.right = right;
    }
};

export class Multiply {
    constructor(left, right) {
        this.left = left;
        this.right = right;
    }
};

export class Divide {
    constructor(left, right) {
        this.left = left;
        this.right = right;
    }
};

export class Add {
    constructor(left, right) {
        this.left = left;
        this.right = right;
    }
};

export class Subtract {
    constructor(left, right) {
        this.left = left;
        this.right = right;
    }
};

////////////////////////////////////////////////////////////////

export class Assignment {
    constructor(name, expression) {
        this.name = name;
        this.expression = expression;
    }
};

export class FunctionDefinition {
    constructor(name, parameters, expression) {
        this.name = name;
        this.parameters = parameters;
        this.expression = expression;
    }
};