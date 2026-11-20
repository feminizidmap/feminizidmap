"use client";

import { forwardRef } from "react";
import { FunnelIcon, ListIcon, MapIcon } from "./MapIcons";

function casesCount(count, suffix = "") {
  return `${count} ${count === 1 ? "Fall" : "Fälle"}${suffix}`;
}

// Mobile: the bottom bar of both views. Summarizes the current cases; the filter button opens the
// filter sheet, the rightmost button toggles between map and case list (view = the current view).
const MobileCaseBar = forwardRef(function MobileCaseBar(
  {
    status,
    filteredCount,
    selectionCount,
    summary,
    activeCount,
    filterOpen,
    onOpenFilters,
    onToggleView,
    onClearSelection,
    view = "map",
    toggleRef,
  },
  ref
) {
  const toggleLabel = view === "map" ? "Liste" : "Zurück zur Karte";
  const hasSelection = selectionCount !== null;
  const title =
    status === "loading"
      ? "Fälle werden geladen…"
      : status === "error"
        ? "Fälle konnten nicht geladen werden"
        : hasSelection
          ? casesCount(selectionCount, " angeklickt")
          : casesCount(filteredCount);
  const sub = hasSelection ? `aus ${filteredCount} gefilterten Fällen` : summary;

  return (
    <div className={`mobile-case-bar${view === "list" ? " is-in-panel" : ""}`} ref={ref}>
      <div className="mobile-case-bar-text">
        <b>{title}</b>
        {status === "ready" && <span>{sub}</span>}
      </div>
      {hasSelection && view === "map" && (
        <button type="button" className="mobile-case-bar-clear" aria-label="Auswahl aufheben" onClick={onClearSelection}>
          ×
        </button>
      )}
      <button
        type="button"
        className="mobile-case-bar-icon"
        aria-label="Filter"
        title="Filter"
        aria-expanded={filterOpen}
        disabled={status !== "ready"}
        onClick={onOpenFilters}
      >
        <FunnelIcon size={20} />
        {activeCount > 0 && <span className="filter-badge">{activeCount}</span>}
      </button>
      <button
        type="button"
        ref={toggleRef}
        className="mobile-case-bar-icon is-primary"
        aria-label={toggleLabel}
        title={toggleLabel}
        disabled={status !== "ready"}
        onClick={onToggleView}
      >
        {view === "map" ? <ListIcon /> : <MapIcon />}
      </button>
    </div>
  );
});

export default MobileCaseBar;
