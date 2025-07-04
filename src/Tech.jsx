import React, { useEffect, useState } from "react";
import "./Tech.css";

// TechCard component for each tech
const TechCard = ({ tech }) => (
  <div
    className="tech-card"
    tabIndex={0}
    aria-label={`Show details for ${tech.name}`}
  >
    <span className="tech-card-title">{tech.name}</span>
    <span className="tech-card-cost">
      {tech.baseCost}{" "}
      <img
        src={`../yieldImg/science.webp`}
        alt={"science"}
        onError={(e) => {
          // Show a simple fallback if image is missing
          e.target.style.display = "none";
          e.target.parentNode.textContent = "No image available";
        }}
      />
    </span>
  </div>
);

// TechCarousel component
const TechCarousel = () => {
  const [techs, setTechs] = useState([]);

  useEffect(() => {
    fetch("/jsonFiles/Techs.json")
      .then((res) => res.json())
      .then((data) => setTechs(data.Techs || []));
  }, []);

  // Create a 20x8 grid (columns x rows)
  const columns = 20;
  const rows = 8;
  // Fill grid with nulls
  const grid = Array.from({ length: rows }, () => Array(columns).fill(null));
  // Place techs in their grid positions
  techs.forEach((tech) => {
    if (
      typeof tech.column === "number" &&
      typeof tech.row === "number" &&
      tech.column >= 0 &&
      tech.column < columns &&
      tech.row >= 0 &&
      tech.row < rows
    ) {
      grid[tech.row][tech.column] = tech;
    }
  });

  return (
    <section className="tech-carousel" aria-label="Technologies" tabIndex="0">
      <h2 className="tech-carousel-title">Technologies</h2>
      <div className="tech-carousel-grid">
        {grid
          .flat()
          .map((tech, idx) =>
            tech ? (
              <TechCard key={tech.name} tech={tech} />
            ) : (
              <div
                key={idx}
                className="tech-card tech-card-empty"
                aria-hidden="true"
              ></div>
            )
          )}
      </div>
    </section>
  );
};

export default TechCarousel;
