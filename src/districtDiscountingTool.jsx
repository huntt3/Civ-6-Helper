import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import DistrictDiscountingToolPage from "./PageJSX/districtDiscountingTool.jsx";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<DistrictDiscountingToolPage />);
