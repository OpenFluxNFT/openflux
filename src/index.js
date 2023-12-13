import React from "react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createRoot } from "react-dom/client";
import { Web3ReactProvider } from "web3-connector";
import { getConnectors } from "web3-connector";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
const connectors = getConnectors({
  1: [`${window.config.infura_endpoint}`],
});

root.render(
  <React.StrictMode>
    <BrowserRouter>
    <Web3ReactProvider connectors={connectors}>
        <App />
    </Web3ReactProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
