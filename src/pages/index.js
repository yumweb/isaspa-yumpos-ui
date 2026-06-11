import React from "react";
import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";

// core styles
import "./scss/volt.scss";

import HomePage from "./pages/HomePage";

ReactDOM.render(
  <HashRouter>
    <HomePage />
  </HashRouter>,
  document.getElementById("root")
);