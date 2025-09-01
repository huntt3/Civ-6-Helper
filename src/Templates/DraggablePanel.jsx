import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { FaTimes } from "react-icons/fa";

/**
 * Draggable panel template for settings and legends
 * Provides consistent styling with semi-transparent background and drag functionality
 */
const DraggablePanel = ({
  id,
  title,
  isOpen,
  onClose,
  children,
  position = { x: 20, y: 20 },
  width = "auto",
  maxWidth = "320px",
  className = "",
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  if (!isOpen) return null;

  const style = {
    position: "absolute",
    left: transform ? position.x + transform.x : position.x,
    top: transform ? position.y + transform.y : position.y,
    width,
    maxWidth,
    zIndex: 50,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-gray-900 border border-gray-600 rounded-lg shadow-2xl ${className}`}
      {...attributes}
    >
      {/* Draggable Header */}
      <div
        {...listeners}
        className="bg-gray-800 text-white px-4 py-3 rounded-t-lg cursor-move select-none flex justify-between items-center"
      >
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <button
          onClick={onClose}
          className="text-gray-300 hover:text-white transition-colors p-1 rounded hover:bg-gray-700"
          type="button"
          aria-label={`Close ${title}`}
        >
          <FaTimes size={12} />
        </button>
      </div>

      {/* Panel Content */}
      <div className="p-4 text-white">{children}</div>
    </div>
  );
};

export default DraggablePanel;
