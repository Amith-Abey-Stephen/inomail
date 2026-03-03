// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

// ✅ Bootstrap CSS (GLOBAL)
import "bootstrap/dist/css/bootstrap.min.css";

// Your custom CSS
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
