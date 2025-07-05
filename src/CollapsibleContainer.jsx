import React from "react";
import "./CollapsibleContainer.css";

// CollapsibleContainer: a generic container with title, collapse, and refresh
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
  <section className={`collapsible-container ${className}`} aria-label={title}>
    <div className={`collapsible-header ${headerClass}`}>
      <h2 className={`collapsible-title ${titleClass}`}>{title}</h2>
      <button
        className="collapsible-collapse-btn"
        onClick={onCollapse}
        aria-label={collapsed ? `Expand ${title}` : `Collapse ${title}`}
      >
        {collapsed ? expandLabel : collapseLabel}
      </button>
      <button
        className="collapsible-refresh-btn"
        onClick={onRefresh}
        aria-label={`Refresh ${title}`}
      >
        Refresh
      </button>
    </div>
    {!collapsed && <div className="collapsible-content">{children}</div>}
  </section>
);

export default CollapsibleContainer;
