import { useCallback, useLayoutEffect, useState, type RefObject } from "react";

const ROW_HEIGHT_VAR = "--employee-row-height";
const FALLBACK_ROW_HEIGHT = 73;
const DEFAULT_GUTTER = 8;

interface UseFitRowsOptions {
  bodyRef: RefObject<HTMLElement | null>;
  footerRef?: RefObject<HTMLElement | null>;
  minRows?: number;
  gutter?: number;
}

function readRowHeight(el: HTMLElement): number {
  const raw = getComputedStyle(el).getPropertyValue(ROW_HEIGHT_VAR).trim();
  if (!raw.endsWith("px")) return FALLBACK_ROW_HEIGHT;
  const px = Number.parseFloat(raw);
  return Number.isFinite(px) && px > 0 ? px : FALLBACK_ROW_HEIGHT;
}
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

    setRows(Math.max(minRows, Math.floor(available / rowHeight)));
  }, [bodyRef, footerRef, minRows, gutter]);

  useLayoutEffect(() => {
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
