import React from "react";

const navLinks = [
  { href: "index.html", label: "Home" },
  { href: "districtDiscountingTool.html", label: "District Discounting Tool" },
  { href: "eraScoreTracker.html", label: "Era Score Tracker" },
  { href: "greatPeopleTracker.html", label: "Great People Tracker" },
  { href: "hexPlanner.html", label: "Hex Planner" },
  { href: "techsAndCivicsTree.html", label: "Techs and Civics Tree" },
];

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white px-4 py-2 shadow flex items-center justify-between">
      <div className="flex space-x-4">
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="hover:bg-gray-700 rounded px-3 py-2 transition-colors font-semibold"
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
