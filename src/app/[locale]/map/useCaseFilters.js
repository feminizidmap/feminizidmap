"use client";

import { useCallback, useMemo, useState } from "react";
import {
  GENDER_OPTIONS,
  getGenderKey,
  getMonth,
  getMonthBounds,
  getSearchText,
  getStateCode,
  getTypeKey,
  isAttempt,
  isFullRange,
  sortTypes,
} from "./filterUtils";

export function sortCasesByDateDesc(caseList) {
  return [...caseList].sort((a, b) => {
    const dateA = Date.parse(a?.crime_date || "");
    const dateB = Date.parse(b?.crime_date || "");
    if (!Number.isFinite(dateA) && !Number.isFinite(dateB)) return 0;
    if (!Number.isFinite(dateA)) return 1;
    if (!Number.isFinite(dateB)) return -1;
    return dateB - dateA;
  });
}

// Shared filtering engine behind both the map and the database list: date range, Bundesland, type of
// feminicide, Versuch, perpetrator gender and free-text search all live here, so both views apply the
// exact same matching rules and facet counts instead of drifting apart with separate implementations.
export default function useCaseFilters(cases) {
  const [query, setQuery] = useState("");
  const [range, setRange] = useState(null);
  const [states, setStates] = useState([]);
  const [types, setTypes] = useState([]);
  const [attempt, setAttempt] = useState("all");
  const [gender, setGender] = useState([]);

  const entries = useMemo(
    () =>
      cases.map((caseItem) => ({
        caseItem,
        month: getMonth(caseItem),
        state: getStateCode(caseItem),
        type: getTypeKey(caseItem),
        attempt: isAttempt(caseItem),
        gender: getGenderKey(caseItem),
        search: getSearchText(caseItem),
      })),
    [cases]
  );

  const bounds = useMemo(() => getMonthBounds(entries.map(({ month }) => month)), [entries]);
  const from = bounds ? Math.max(bounds.min, range?.[0] ?? bounds.min) : 0;
  const to = bounds ? Math.min(bounds.max, range?.[1] ?? bounds.max) : 0;
  const fullRange = isFullRange(from, to, bounds);
  const needle = query.trim().toLowerCase();

  // `except` skips one filter, so each section can count "all other filters" without zeroing its own options.
  // Cases without a valid date / Bundesland / type only match while that filter is inactive.
  const matches = useCallback(
    (entry, except = null) =>
      (except === "query" || !needle || entry.search.includes(needle)) &&
      (except === "date" || fullRange || (entry.month !== null && entry.month >= from && entry.month <= to)) &&
      (except === "states" || states.length === 0 || (entry.state !== null && states.includes(entry.state))) &&
      (except === "types" || types.length === 0 || (entry.type !== null && types.includes(entry.type))) &&
      (except === "attempt" || attempt === "all" || entry.attempt === (attempt === "yes")) &&
      (except === "gender" || gender.length === 0 || gender.includes(entry.gender)),
    [needle, fullRange, from, to, states, types, attempt, gender]
  );

  const filteredEntries = useMemo(() => entries.filter((entry) => matches(entry)), [entries, matches]);

  const filteredCases = useMemo(
    () => sortCasesByDateDesc(filteredEntries.map(({ caseItem }) => caseItem)),
    [filteredEntries]
  );

  // Counts per option of one facet, with every other filter applied.
  const countBy = useCallback(
    (except, keyOf) => {
      const counts = {};
      for (const entry of entries) {
        const key = keyOf(entry);
        if (key !== null && matches(entry, except)) {
          counts[key] = (counts[key] ?? 0) + 1;
        }
      }
      return counts;
    },
    [entries, matches]
  );

  const stateCounts = useMemo(() => countBy("states", (entry) => entry.state), [countBy]);
  const typeCounts = useMemo(() => countBy("types", (entry) => entry.type), [countBy]);
  const genderCounts = useMemo(() => countBy("gender", (entry) => entry.gender), [countBy]);
  const attemptCounts = useMemo(() => {
    const counts = countBy("attempt", (entry) => (entry.attempt ? "yes" : "no"));
    return { all: (counts.yes ?? 0) + (counts.no ?? 0), yes: counts.yes ?? 0, no: counts.no ?? 0 };
  }, [countBy]);

  // Histogram: every filter except the date range, so it always shows the whole timeline.
  const monthCounts = useMemo(() => {
    if (!bounds) return [];
    const counts = new Array(bounds.max - bounds.min + 1).fill(0);
    for (const entry of entries) {
      if (entry.month !== null && matches(entry, "date")) {
        counts[entry.month - bounds.min] += 1;
      }
    }
    return counts;
  }, [entries, bounds, matches]);

  const typeOptions = useMemo(
    () => sortTypes(new Set(entries.map((entry) => entry.type).filter(Boolean))),
    [entries]
  );

  const activeCount =
    (fullRange ? 0 : 1) +
    (states.length > 0 ? 1 : 0) +
    (types.length > 0 ? 1 : 0) +
    (attempt !== "all" ? 1 : 0) +
    (gender.length > 0 ? 1 : 0);

  const resetFilters = useCallback(() => {
    setQuery("");
    setRange(null);
    setStates([]);
    setTypes([]);
    setAttempt("all");
    setGender([]);
  }, []);

  const changeRange = useCallback(
    (nextFrom, nextTo) => {
      setRange(isFullRange(nextFrom, nextTo, bounds) ? null : [nextFrom, nextTo]);
    },
    [bounds]
  );

  const toggleState = useCallback((code) => {
    setStates((current) =>
      current.includes(code) ? current.filter((item) => item !== code) : [...current, code].sort()
    );
  }, []);

  const toggleType = useCallback((type) => {
    setTypes((current) =>
      sortTypes(current.includes(type) ? current.filter((item) => item !== type) : [...current, type])
    );
  }, []);

  const toggleGender = useCallback((key) => {
    setGender((current) => {
      const next = current.includes(key) ? current.filter((item) => item !== key) : [...current, key];
      return GENDER_OPTIONS.map(([value]) => value).filter((value) => next.includes(value));
    });
  }, []);

  // Shape expected by FilterPanel / FilterChipBar / MobileFilterSheet.
  const filters = {
    bounds,
    from,
    to,
    monthCounts,
    stateCounts,
    states,
    typeOptions,
    types,
    typeCounts,
    attempt,
    attemptCounts,
    gender,
    genderCounts,
    activeCount,
    filteredCount: filteredCases.length,
    total: entries.length,
    onRangeChange: changeRange,
    onToggleState: toggleState,
    onToggleType: toggleType,
    onAttemptChange: setAttempt,
    onToggleGender: toggleGender,
    onReset: resetFilters,
  };

  return {
    bounds,
    from,
    to,
    fullRange,
    filteredCases,
    states,
    types,
    attempt,
    gender,
    query,
    setQuery,
    activeCount,
    filters,
    resetFilters,
  };
}
