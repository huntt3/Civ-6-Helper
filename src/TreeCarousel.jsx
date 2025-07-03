import React from "react";
import "./TreeCarousel.css";

// A simple TreeCarousel that is very wide and scrollable horizontally
const TreeCarousel = ({ children }) => {
  return (
    <section
      className="tree-carousel"
      aria-label="Scrollable tree carousel"
      tabIndex="0"
    >
      <div className="tree-carousel-inner">
        {/* Example content for demonstration */}
        {children
          ? children
          : Array.from({ length: 10 }).map((_, i) => (
              <div className="tree-carousel-item" key={i}>
                <span>Item {i + 1}</span>
              </div>
            ))}
      </div>
    </section>
  );
};

export default TreeCarousel;
