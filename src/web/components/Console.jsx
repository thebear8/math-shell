import React from "react";
import { parseMath } from "../../shell/math-parser.js";
import { Context } from "../../shell/math-runtime.js";

export default class Console extends React.Component {
    input = null;
    lineContainer = null;
    mathContext = new Context((c) => this.onCommand(c));
    inputHistory = [];
    inputHistoryIdx = 0;

    state = {
        lines: [],
    };

    render() {
        return (
            <div className="d-flex flex-column container h-75 p-0 border border-dark rounded font-monospace">
                <div className="flex-grow-1 overflow-auto" ref={(e) => this.lineContainer = e}>
                    {this.state.lines.map(this.makeLine)}
                </div>
                <form className="w-100" onSubmit={(e) => this.onSubmit(e)}>
                    <input type="text" className="w-100" style={{ outline: "none" }} ref={(e) => this.input = e} onKeyPress={(e) => this.onKeyPress(e)} onKeyDown={(e) => this.onKeyDown(e)} />
                </form>
            </div>
        );
    }

    componentDidMount() {
        this.input.focus();
        this.lineContainer.scrollTop = this.lineContainer.scrollHeight;
    }

    componentDidUpdate() {
        this.input.focus();
        this.lineContainer.scrollTop = this.lineContainer.scrollHeight;
    }

    makeLine([expression, result], idx) {
        return (
            <div className="m-0" key={idx}>
                <div className="d-flex flex-row">
                    <p className="m-0 user-select-none">&gt;&nbsp;</p>
                    <p className="m-0">{expression}</p>
                </div>
                <div className="d-flex flex-row">
                    <p className="m-0 user-select-none">&nbsp;&nbsp;</p>
                    <p className="m-0">{result}</p>
                </div>
            </div>
        );
    }

    onKeyDown(e) {
        if (e.code === "ArrowUp") {
            e.preventDefault();
            if (this.inputHistoryIdx > 0) {
                this.input.value = this.inputHistory[--this.inputHistoryIdx];
            }
        } else if (e.code === "ArrowDown") {
            e.preventDefault();
            if (this.inputHistoryIdx < this.inputHistory.length - 1) {
                this.input.value = this.inputHistory[++this.inputHistoryIdx];
            }
        } else if(e.code === "Escape") {
            e.preventDefault();
            this.input.value = "";
        }
    }

    onKeyPress(e) {
        if (e.key === "(") {
            this.input.setRangeText(")", this.input.selectionStart, this.input.selectionEnd, "start");
        }
        if (e.key === "[") {
            this.input.setRangeText("]", this.input.selectionStart, this.input.selectionEnd, "start");
        }
        if (e.key === "{") {
            this.input.setRangeText("}", this.input.selectionStart, this.input.selectionEnd, "start");
        }
        if (e.key === "'") {
            this.input.setRangeText("'", this.input.selectionStart, this.input.selectionEnd, "start");
        }
        if (e.key === '"') {
            this.input.setRangeText('"', this.input.selectionStart, this.input.selectionEnd, "start");
        }
    }

    onSubmit(e) {
        e.preventDefault();
        let input = this.input.value;
        if (input.match(/(clear)/)) {
            if (input === "clear") {
                this.mathContext.reset();
                this.setState({ lines: [] });
                this.input.value = "";
            }
        } else {
            let ast = parseMath(input);
            if (ast) {
                try {
                    let result = this.mathContext.evaluate(ast[0]);
                    let value = this.mathContext.describe(result);
                    this.state.lines.push([input, value]);
                    this.setState(this.state);
                    this.input.value = "";
                    this.inputHistory.push(input);
                    this.inputHistoryIdx = this.inputHistory.length;
                } catch (e) {
                    this.state.lines.push([input, e.toString()]);
                    this.setState(this.state);
                }
            } else {
                this.state.lines.push([input, "Syntax Error."]);
                this.setState(this.state);
            }
        }
    }
};