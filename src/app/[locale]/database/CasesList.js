"use client";

import { useCallback, useEffect, useState } from "react";
import CaseList, { LIST_PAGE_SIZE } from "@/app/[locale]/map/CaseList";
import FilterPanel from "@/app/[locale]/map/FilterPanel";
import { FunnelIcon } from "@/app/[locale]/map/MapIcons";
import { FilterChipBar, MobileFilterSheet } from "@/app/[locale]/map/MobileFilters";
import useCaseFilters from "@/app/[locale]/map/useCaseFilters";
import useMediaQuery from "@/app/[locale]/map/useMediaQuery";

// Same filtering engine and filter UI as the map (see useCaseFilters), plus free-text search;
// cards start collapsed like on the map, and open one at a time on click.
export default function CasesList({ cases }) {
  const caseItems = cases?.data || [];
  const isDesktop = useMediaQuery("(min-width: 992px)");
  const { bounds, filteredCases, query, setQuery, activeCount, filters, resetFilters } = useCaseFilters(caseItems);
  const [listLimit, setListLimit] = useState(LIST_PAGE_SIZE);
  const [openCaseIds, setOpenCaseIds] = useState(() => new Set());
  const [filterOpen, setFilterOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const toggleOpenCase = useCallback((id, open) => {
    setOpenCaseIds((current) => {
      if (current.has(id) === open) return current;
      const next = new Set(current);
      if (open) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  // Changing any filter or the search term resets the list pagination.
  useEffect(() => {
    setListLimit(LIST_PAGE_SIZE);
  }, [filteredCases]);

  return (
    <div className="database-layout">
      <div className="database-toolbar">
        <input
          type="search"
          className="state-search database-search"
          placeholder="Suche nach Name, Ort, Bundesland …"
          aria-label="Fälle durchsuchen"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        {isDesktop && bounds && <FilterChipBar filters={filters} onOpen={() => setFilterOpen((open) => !open)} />}
        {isDesktop === false && bounds && (
          <button
            type="button"
            className={`cases-list-filter${sheetOpen ? " is-active" : ""}`}
            aria-expanded={sheetOpen}
            onClick={() => setSheetOpen(true)}
          >
            <FunnelIcon size={18} />
            Filter
            {activeCount > 0 && <span className="filter-badge">{activeCount}</span>}
          </button>
        )}
      </div>

      {isDesktop && filterOpen && bounds && <FilterPanel filters={filters} onClose={() => setFilterOpen(false)} />}

      <CaseList
        status="ready"
        filteredCases={filteredCases}
        selection={null}
        limit={listLimit}
        openCaseIds={openCaseIds}
        onToggleCase={toggleOpenCase}
        onMore={() => setListLimit((limit) => limit + LIST_PAGE_SIZE)}
        onReset={resetFilters}
      />

      {isDesktop === false && bounds && (
        <MobileFilterSheet filters={filters} open={sheetOpen} onClose={() => setSheetOpen(false)} />
      )}
    </div>
  );
}
