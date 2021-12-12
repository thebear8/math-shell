import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap-icons/font/bootstrap-icons.css"

import Console from "./components/Console";

export default class App extends React.Component {
    render() {
        return (
            <div className="d-flex w-100 h-100 justify-content-center align-items-center">
                <Console />
            </div>
        );
    }
}