import React from "react";

const navLinks = [
  { href: "index.html", label: "Home" },
  { href: "techsAndCivicsTree.html", label: "Techs and Civics Tree" },
  { href: "districtDiscountingTool.html", label: "District Discount Tracker" },
  { href: "wonderTracker.html", label: "Wonder Tracker" },
  { href: "greatPeopleTracker.html", label: "Great People Tracker" },
  { href: "eraScoreTracker.html", label: "Era Score Tracker" },
  { href: "hexPlanner.html", label: "Hex Planner" },
];

export default function Navbar() {
  // Get current page (strip leading / if present)
  const currentPage = window.location.pathname.split("/").pop();
  return (
    <nav className="bg-gray-800 text-white px-4 py-2 shadow flex items-center justify-between">
      <div className="flex space-x-4">
        {navLinks.map((link) => {
          const isActive = link.href === currentPage;
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
