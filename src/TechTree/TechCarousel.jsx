import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import TechCard from "./TechCard";
import TechModal from "./TechModal";
import TechArrows from "./TechArrows";

const TechCarousel = forwardRef(
  (
    {
      rowRange,
      minRow = 0,
      onReset,
      allTechs,
      setAllTechs,
      hoveredTech,
      setHoveredTech,
    },
    ref
  ) => {
    const [modalTech, setModalTech] = useState(null);

    // Pan and zoom state
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const containerRef = React.useRef(null);

    // Add wheel event listener with passive: false to allow preventDefault
    useEffect(() => {
      const containerElement = containerRef.current;
      if (!containerElement) return;

      const wheelHandler = (e) => {
        e.preventDefault();
        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
        setZoom((prevZoom) =>
          Math.max(0.5, Math.min(3, prevZoom * zoomFactor))
        );
      };

      containerElement.addEventListener("wheel", wheelHandler, {
        passive: false,
      });

      return () => {
        containerElement.removeEventListener("wheel", wheelHandler);
      };
    }, []);

    // Mouse event handlers for pan functionality
    const handleMouseDown = (e) => {
      if (
        e.target.closest(".tech-card") ||
        e.target.closest(".details-btn") ||
        e.target.closest(".boost-checkbox")
      ) {
        return; // Don't start panning if clicking on a tech card or its interactive elements
      }
      setIsDragging(false);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    };

    const handleMouseMove = (e) => {
      if (dragStart.x !== 0 || dragStart.y !== 0) {
        const deltaX = Math.abs(e.clientX - (dragStart.x + pan.x));
        const deltaY = Math.abs(e.clientY - (dragStart.y + pan.y));

        if (deltaX > 5 || deltaY > 5) {
          setIsDragging(true);
        }

        setPan({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        });
      }
    };

    const handleMouseUp = () => {
      setDragStart({ x: 0, y: 0 });
      setTimeout(() => setIsDragging(false), 100);
    };

    // Expose reset view functionality
    useImperativeHandle(
      ref,
      () => ({
        resetView: () => {
          setZoom(1);
          setPan({ x: 0, y: 0 });
        },
      }),
      []
    );

    // Use allTechs from parent instead of local state
    const techs = allTechs;

    // Keep the localStorage save effect but use setAllTechs instead of setTechs
    useEffect(() => {
      if (!techs.length) return;
      const state = {};
      techs.forEach((t) => {
        state[t.name] = {
          researched: !!t.researched,
          boosted: !!t.boosted,
        };
      });
      localStorage.setItem("civ6_tech_state", JSON.stringify(state));
    }, [techs]);

    // Expose reset logic to parent via onReset prop using useEffect and useCallback
    React.useEffect(() => {
      if (!onReset) return;
      onReset(() => {
        setAllTechs((prev) =>
          prev.map((t) => ({ ...t, researched: false, boosted: false }))
        );
        const state = {};
        techs.forEach((t) => {
          state[t.name] = { researched: false, boosted: false };
        });
        localStorage.setItem("civ6_tech_state", JSON.stringify(state));
      });
      // Only run once when mounted
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onReset, setAllTechs, techs]);

    const handleResearch = (name) => {
      setAllTechs((prev) =>
        prev.map((t) =>
          t.name === name ? { ...t, researched: !t.researched } : t
        )
      );
    };

    const handleBoostToggle = (name) => {
      setAllTechs((prev) =>
        prev.map((t) => (t.name === name ? { ...t, boosted: !t.boosted } : t))
      );
    };

    const handleShowDetails = (tech) => {
      setModalTech(tech);
    };

    const handleCloseModal = () => {
      setModalTech(null);
    };

    const columns = 20;
    // Filter techs by rowRange if provided
    let filteredTechs = techs;
    if (
      rowRange &&
      typeof rowRange.start === "number" &&
      typeof rowRange.end === "number"
    ) {
      filteredTechs = techs.filter(
        (t) =>
          typeof t.row === "number" &&
          t.row >= rowRange.start &&
          t.row <= rowRange.end
      );
    }
    // Find the max row value in the filtered data to ensure all rows are shown
    const maxRow = Math.max(
      ...filteredTechs.map((t) => (typeof t.row === "number" ? t.row : minRow)),
      minRow
    );
    const rows = Math.max(1, maxRow - minRow + 1);
    const grid = Array.from({ length: rows }, () => Array(columns).fill(null));
    filteredTechs.forEach((tech) => {
      if (
        typeof tech.column === "number" &&
        typeof tech.row === "number" &&
        tech.column >= 0 &&
        tech.column < columns &&
        tech.row >= minRow &&
        tech.row <= maxRow
      ) {
        grid[tech.row - minRow][tech.column] = tech;
      }
    });

    const arrowData = [];
    const cardWidth = 120;
    const cardHeight = 100;
    const gap = 40;
    techs.forEach((tech) => {
      if (!tech.prerequisites || !Array.isArray(tech.prerequisites)) return;
      tech.prerequisites.forEach((prereqName) => {
        const prereq = filteredTechs.find((t) => t.name === prereqName);
        if (!prereq) return;
        const fromCol = prereq.column;
        const fromRow = prereq.row;
        const toCol = tech.column;
        const toRow = tech.row;
        if (
          typeof fromCol !== "number" ||
          typeof fromRow !== "number" ||
          typeof toCol !== "number" ||
          typeof toRow !== "number"
        )
          return;
        if (
          fromCol >= 0 &&
          fromCol < columns &&
          toCol >= 0 &&
          toCol < columns &&
          fromRow >= minRow &&
          fromRow <= maxRow &&
          toRow >= minRow &&
          toRow <= maxRow
        ) {
          const x1 = fromCol * (cardWidth + gap) + cardWidth;
          const y1 = (fromRow - minRow) * (cardHeight + gap) + cardHeight / 1.5;
          const x2 = toCol * (cardWidth + gap);
          const y2 = (toRow - minRow) * (cardHeight + gap) + cardHeight / 1.5;
          arrowData.push({ x1, y1, x2, y2 });
        }
      });
    });

    // Find boostPrerequisites for hovered card - now using all techs for cross-container highlighting
    let boostsSet = new Set();
    let boostedBySet = new Set();
    if (hoveredTech) {
      // Cards that this hovered card boosts
      boostsSet = new Set(hoveredTech.boostPrerequisites || []);
      // Cards that list this hovered card in their boostPrerequisites - search ALL techs, not just filtered ones
      boostedBySet = new Set(
        techs
          .filter((t) =>
            (t.boostPrerequisites || []).includes(hoveredTech.name)
          )
          .map((t) => t.name)
      );
    }

    return (
      <section
        ref={containerRef}
        className="w-full h-96 bg-white rounded-3xl shadow-lg overflow-hidden cursor-grab active:cursor-grabbing"
        aria-label="Technologies"
        tabIndex="0"
        style={{ position: "relative" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
          }}
        ></header>
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "0 0",
            width: columns * (cardWidth + gap),
            height: rows * (cardHeight + gap),
            position: "relative",
            transition: isDragging ? "none" : "transform 0.1s ease-out",
          }}
        >
          <svg
            className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
            width={columns * (cardWidth + gap)}
            height={rows * (cardHeight + gap)}
          >
            <TechArrows
              arrowData={arrowData}
              columns={columns}
              rows={rows}
              cardWidth={cardWidth}
              cardHeight={cardHeight}
              gap={gap}
              zoom={zoom}
            />
          </svg>
          <div
            className="grid gap-10 py-4 relative z-10"
            style={{
              gridTemplateColumns: `repeat(${columns}, ${cardWidth}px)`,
              gridTemplateRows: `repeat(${rows}, ${cardHeight}px)`,
              gap: `${gap}px`,
            }}
          >
            {grid.flat().map((tech, idx) => {
              if (!tech) {
                return (
                  <div
                    key={idx}
                    className="bg-transparent shadow-none border-none cursor-default"
                    aria-hidden="true"
                  ></div>
                );
              }
              let extraClass = "";
              if (hoveredTech && tech.name === hoveredTech.name) {
                if (tech.techCivic === "Tech") {
                  extraClass = "ring-4 ring-yellow-400";
                } else {
                  extraClass = "ring-4 ring-purple-400";
                }
              } else if (hoveredTech && boostsSet.has(tech.name)) {
                if (tech.techCivic === "Tech") {
                  extraClass = "ring-2 ring-green-400";
                } else {
                  extraClass = "ring-2 ring-blue-400";
                }
              } else if (hoveredTech && boostedBySet.has(tech.name)) {
                if (tech.techCivic === "Tech") {
                  extraClass = "ring-2 ring-orange-400";
                } else {
                  extraClass = "ring-2 ring-pink-400";
                }
              }
              return (
                <TechCard
                  key={tech.name}
                  tech={tech}
                  allTechs={filteredTechs}
                  onResearch={handleResearch}
                  onBoostToggle={handleBoostToggle}
                  onShowDetails={handleShowDetails}
                  hoverClass={`tech-card ${extraClass}`}
                  onHover={() => setHoveredTech(tech)}
                  onUnhover={() => setHoveredTech(null)}
                  techCivic={tech.techCivic}
                />
              );
            })}
          </div>
        </div>
        <TechModal tech={modalTech} onClose={handleCloseModal} />
      </section>
    );
  }
);

TechCarousel.displayName = "TechCarousel";

export default TechCarousel;
