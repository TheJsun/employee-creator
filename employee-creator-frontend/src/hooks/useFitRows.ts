import { useCallback, useLayoutEffect, useState, type RefObject } from "react";

const ROW_HEIGHT_VAR = "--employee-row-height";

// Matches --employee-row-height in EmployeeList.module.scss; only used if the
// custom property is missing or not expressed in px.
const FALLBACK_ROW_HEIGHT = 73;

// Small breathing room so the last row never sits flush against the footer.
const DEFAULT_GUTTER = 8;

interface UseFitRowsOptions {
  /** The element rows render into. Its top edge is the measurement anchor. */
  bodyRef: RefObject<HTMLElement | null>;
  /** Fixed-height chrome below the list (the pagination bar) to reserve space for. */
  footerRef?: RefObject<HTMLElement | null>;
  minRows?: number;
  gutter?: number;
}

function readRowHeight(el: HTMLElement): number {
  // Custom properties come back unresolved, so an em value would parse to a
  // meaningless number. Only trust an explicit px value.
  const raw = getComputedStyle(el).getPropertyValue(ROW_HEIGHT_VAR).trim();
  if (!raw.endsWith("px")) return FALLBACK_ROW_HEIGHT;
  const px = Number.parseFloat(raw);
  return Number.isFinite(px) && px > 0 ? px : FALLBACK_ROW_HEIGHT;
}

/**
 * How many rows of --employee-row-height fit between the top of `bodyRef` and
 * the bottom of the viewport, leaving room for `footerRef`.
 *
 * The result is deliberately independent of what is currently rendered, or the
 * page size would oscillate: rows lay out *below* the body's top edge so
 * adding them never moves that edge, every loading/error/empty state lives
 * inside the body for the same reason, and the footer's height is fixed in
 * CSS. Positions are document-relative so the count does not change with
 * scroll position either (below the `md` breakpoint the shell is not
 * `overflow: hidden`, so the page can scroll).
 */
export function useFitRows({
  bodyRef,
  footerRef,
  minRows = 3,
  gutter = DEFAULT_GUTTER,
}: UseFitRowsOptions): number {
  const [rows, setRows] = useState(minRows);

  const measure = useCallback(() => {
    const body = bodyRef.current;
    if (!body) return;

    const rowHeight = readRowHeight(body);
    const bodyTop = body.getBoundingClientRect().top + window.scrollY;
    const reservedBelow = (footerRef?.current?.offsetHeight ?? 0) + gutter;
    const available = window.innerHeight - bodyTop - reservedBelow;

    // Setting an identical count is a React bail-out, so the integer
    // quantisation is its own debounce: a drag-resize only re-renders at row
    // boundaries, and no explicit throttling is needed.
    setRows(Math.max(minRows, Math.floor(available / rowHeight)));
  }, [bodyRef, footerRef, minRows, gutter]);

  useLayoutEffect(() => {
    // ResizeObserver rather than window.resize alone: the shell also reflows on
    // zoom, font load, orientation change and mobile URL-bar collapse, none of
    // which reliably fire a resize event. observe() fires once, which covers
    // the initial measurement before first paint.
    const observer = new ResizeObserver(measure);
    observer.observe(document.documentElement);
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  return rows;
}
