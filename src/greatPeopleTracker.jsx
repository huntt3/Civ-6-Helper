import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import GreatPeopleTrackerPage from "./PageJSX/greatPeopleTracker.jsx";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<GreatPeopleTrackerPage />);
