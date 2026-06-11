import { BrowserRouter } from "react-router-dom";

// core styles
import "./scss/volt.scss";
import HomePage from "./pages/HomePage";
import { createRoot } from "react-dom/client";

const container = document.getElementById("root");
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
root.render(
  <BrowserRouter>
    <HomePage />
  </BrowserRouter>
);
