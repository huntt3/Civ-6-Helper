import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  DragOverlay,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import TechCard from "./TechCard";
import TechModal from "./TechModal";
import TechArrows from "./TechArrows";

// Droppable slot component for empty grid positions
const DroppableSlot = ({ row, col, children }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `slot-${row}-${col}`,
  });

  const style = {
    backgroundColor: isOver ? "rgba(0, 255, 0, 0.1)" : "transparent",
  };

  return (
    <div ref={setNodeRef} style={style} className="w-full h-full">
      {children}
    </div>
  );
};

// Draggable tech card wrapper
const DraggableTechCard = ({ tech, ...props }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: tech.name,
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
      }
    : {};

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <TechCard tech={tech} {...props} />
    </div>
  );
};

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
    const [activeId, setActiveId] = useState(null);

    // Define draggable Future Era cards
    const draggableTechs = [
      "Advanced AI",
      "Advanced Power Cells",
      "Cybernetics",
      "Predictive Systems",
      "Seasteads",
      "Smart Materials",
      "Offworld Mission",
      "Future Tech",
    ];

    const draggableCivics = [
      "Information Warfare",
      "Global Warming Mitigation",
      "Cultural Hegemony",
      "Smart Power Doctrine",
      "Exodus Imperative",
      "Future Civic",
    ];

    const draggableCards = [...draggableTechs, ...draggableCivics];

    const handleDragStart = (event) => {
      setActiveId(event.active.id);
    };

    const handleDragEnd = (event) => {
      const { active, over } = event;

      if (!over || !active) {
        setActiveId(null);
        return;
      }

      const draggedTechName = active.id;
      const targetSlot = over.id; // This should be "slot-row-col" format

      if (!targetSlot.startsWith("slot-")) {
        setActiveId(null);
        return;
      }

      // Parse the slot ID to get row and column
      const slotParts = targetSlot.split("-");
      if (slotParts.length !== 3) {
        setActiveId(null);
        return;
      }

      const targetRow = parseInt(slotParts[1]) + minRow; // Add minRow offset
      const targetCol = parseInt(slotParts[2]);

      const draggedTech = allTechs.find((t) => t.name === draggedTechName);

      if (!draggedTech || !draggableCards.includes(draggedTechName)) {
        setActiveId(null);
        return;
      }

      // Check column constraints
      const isTechCard = draggedTech.techCivic === "Tech";
      const isCivicCard = draggedTech.techCivic === "Civic";

      const allowedTechColumns = [17, 18, 19];
      const allowedCivicColumns = [18, 19, 20];

      const isValidDrop =
        (isTechCard && allowedTechColumns.includes(targetCol)) ||
        (isCivicCard && allowedCivicColumns.includes(targetCol));

      if (!isValidDrop) {
        setActiveId(null);
        return;
      }

      // Update tech position
      setAllTechs((prev) =>
        prev.map((tech) => {
          if (tech.name === draggedTechName) {
            return { ...tech, row: targetRow, column: targetCol };
          }
          return tech;
        })
      );

      setActiveId(null);
    };

    // Pan and zoom state - start with smaller zoom to show more cards
    const [zoom, setZoom] = useState(0.6);
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
        // Allow more zoom out to show all cards (0.3) and more zoom in (5)
        setZoom((prevZoom) =>
          Math.max(0.45, Math.min(5, prevZoom * zoomFactor))
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

        // Clamp pan so the grid cannot be dragged out of view
        const gridWidth = columns * (cardWidth + gap);
        const gridHeight = rows * (cardHeight + gap);
        const container = containerRef.current;
        const containerWidth = container ? container.offsetWidth : 800;
        const containerHeight = container ? container.offsetHeight : 500;

        let newX = e.clientX - dragStart.x;
        let newY = e.clientY - dragStart.y;

        // Clamp so the grid cannot be dragged out of view
        newX = Math.min(0, Math.max(newX, containerWidth - gridWidth * zoom));
        newY = Math.min(0, Math.max(newY, containerHeight - gridHeight * zoom));

        setPan({
          x: newX,
          y: newY,
        });
      }
    };

    const handleMouseUp = () => {
      setDragStart({ x: 0, y: 0 });
      setTimeout(() => setIsDragging(false), 100);
    };

    // Expose reset view functionality - reset to default smaller zoom
    useImperativeHandle(
      ref,
      () => ({
        resetView: () => {
          setZoom(0.6);
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

    // Save position changes for draggable cards
    useEffect(() => {
      if (!techs.length) return;
      const positionData = {};
      techs.forEach((t) => {
        if (draggableCards.includes(t.name)) {
          positionData[t.name] = {
            row: t.row,
            column: t.column,
          };
        }
      });
      localStorage.setItem("civ6_tech_positions", JSON.stringify(positionData));
    }, [techs, draggableCards]);

    // Expose reset logic to parent via onReset prop using useEffect and useCallback
    React.useEffect(() => {
      if (!onReset) return;
      onReset(() => {
        // Reset researched/boosted states and restore original positions
        fetch("./jsonFiles/TechsAndCivics.json")
          .then((res) => res.json())
          .then((originalData) => {
            setAllTechs((prev) =>
              prev.map((t) => {
                // Find the original tech data to restore original position
                const originalTech = (originalData.Techs || []).find(
                  (orig) => orig.name === t.name
                );
                const originalPosition = originalTech
                  ? { row: originalTech.row, column: originalTech.column }
                  : {};
                return {
                  ...t,
                  researched: false,
                  boosted: false,
                  ...originalPosition, // Restore original position
                };
              })
            );

            // Clear both localStorage entries
            const state = {};
            techs.forEach((t) => {
              state[t.name] = { researched: false, boosted: false };
            });
            localStorage.setItem("civ6_tech_state", JSON.stringify(state));
            localStorage.removeItem("civ6_tech_positions"); // Clear position data
          });
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

    const columns = 21;
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
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <section
          ref={containerRef}
          className="w-full h-[500px] bg-white rounded-3xl shadow-lg overflow-hidden cursor-grab active:cursor-grabbing"
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
              {grid
                .map((row, rowIdx) =>
                  row.map((tech, colIdx) => {
                    const key = tech ? tech.name : `empty-${rowIdx}-${colIdx}`;

                    if (!tech) {
                      return (
                        <DroppableSlot key={key} row={rowIdx} col={colIdx} />
                      );
                    }

                    const isDraggable = draggableCards.includes(tech.name);

                    let extraClass = "";
                    // Only yellow rings for all hover states
                    if (
                      hoveredTech &&
                      (tech.name === hoveredTech.name ||
                        boostsSet.has(tech.name) ||
                        boostedBySet.has(tech.name))
                    ) {
                      extraClass = "ring-7 ring-amber-400";
                    }

                    if (isDraggable) {
                      return (
                        <DraggableTechCard
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
                  })
                )
                .flat()}
            </div>
          </div>
          <TechModal tech={modalTech} onClose={handleCloseModal} />
        </section>
      </DndContext>
    );
  }
);

TechCarousel.displayName = "TechCarousel";

export default TechCarousel;
