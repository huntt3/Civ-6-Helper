import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import WonderTrackerPage from "./PageJSX/wonderTracker.jsx";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<WonderTrackerPage />);
