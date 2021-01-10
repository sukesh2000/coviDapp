import React from "react";
import ReactDOM from "react-dom";
import { Router } from "@reach/router";
import Hospital from "./Hospital";
import CentralGov from "./CentralGov";
import StateGov from "./StateGov";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <div className="dummyBG"></div>
    <Router>
      <Hospital path="/hospital"/>
      <CentralGov path="/centralGov"/>
      <StateGov path="/stateGov"/>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
