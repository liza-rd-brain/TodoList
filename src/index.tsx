import { createRoot } from "react-dom/client";
import React from "react";
import { App } from "./App";
import "./index.less";

const container = document.getElementById("app") as HTMLElement;

const root = createRoot(container);
root.render(<App />);
