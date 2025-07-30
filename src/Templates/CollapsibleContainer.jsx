import React from "react";

// CollapsibleContainer: a generic container with title, collapse, and reset
const CollapsibleContainer = ({
  title,
  collapsed,
  onCollapse,
  onRefresh,
  children,
  className = "",
  headerClass = "",
  titleClass = "",
  collapseLabel = "Collapse",
  expandLabel = "Expand",
}) => (
  <section
    className={`my-8 mx-auto p-4 max-w-full bg-white text-gray-900 rounded-lg shadow-md ${className}`}
    aria-label={title}
  >
    <div className={`flex items-center gap-4 mb-4 ${headerClass}`}>
      <h2
        className={`flex-1 text-xl m-0 font-semibold text-gray-900 font-sans ${titleClass}`}
      >
        {title}
      </h2>
      <button
        className="bg-blue-600 text-white border-none rounded px-4 py-1 text-base cursor-pointer font-sans transition-colors duration-200 mr-2 hover:bg-blue-700 focus:bg-blue-700 focus:outline-none"
        onClick={onCollapse}
        aria-label={collapsed ? `Expand ${title}` : `Collapse ${title}`}
      >
        {collapsed ? expandLabel : collapseLabel}
      </button>
      <button
        className="bg-green-600 text-white border-none rounded px-4 py-1 text-base cursor-pointer font-sans transition-colors duration-200 hover:bg-green-700 focus:bg-green-700 focus:outline-none"
        onClick={onRefresh}
        aria-label={`Reset ${title}`}
      >
        Reset
      </button>
    </div>
    {!collapsed && (
      <div className="w-full bg-gray-50 text-gray-900 rounded-md p-2">
        {children}
      </div>
    )}
  </section>
);

export default CollapsibleContainer;
