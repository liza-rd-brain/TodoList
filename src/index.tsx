import { createRoot } from "react-dom/client";
import React from "react";
import { App } from "./App";
import "./index.css";

const container = document.getElementById("app") as HTMLElement;

const root = createRoot(container);
root.render(<App />);
