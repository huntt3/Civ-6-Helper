import React from "react";

const navLinks = [
  { href: "./", label: "Home" },
  { href: "./techsAndCivicsTree.html", label: "Techs and Civics Tree" },
  {
    href: "./districtDiscountingTool.html",
    label: "District Discount Tracker",
  },
  { href: "./wonderTracker.html", label: "Wonder Tracker" },
  { href: "./greatPeopleTracker.html", label: "Great People Tracker" },
  { href: "./eraScoreTracker.html", label: "Era Score Tracker" },
  { href: "./hexPlanner.html", label: "Hex Planner" },
];

export default function Navbar() {
  // Get current page (strip leading / if present)
  const currentPath = window.location.pathname;
  const currentPage = currentPath.split("/").pop();

  // Handle root path and index.html both as "home"
  const isHomePage =
    currentPage === "" ||
    currentPage === "index.html" ||
    currentPath.endsWith("/");

  return (
    <nav className="bg-gray-800 text-white px-4 py-2 shadow flex items-center justify-between">
      <div className="flex space-x-4">
        {navLinks.map((link) => {
          let isActive = false;
          if (link.href === "./") {
            isActive = isHomePage;
          } else {
            isActive = link.href.replace("./", "") === currentPage;
          }

          return (
            <a
              key={link.href}
              href={link.href}
              className={`rounded px-3 py-2 transition-colors font-semibold ${
                isActive
                  ? "bg-yellow-400 text-gray-900 shadow font-bold"
                  : "hover:bg-gray-700"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              {link.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
