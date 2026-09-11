import { useState, useEffect } from "react";

const BREAKPOINTS = {
  sm: 480,
  md: 700,
  lg: 900,
  xl: 1280,
};

function getColumnsForWidth(width: number): number {
  if (width >= BREAKPOINTS.xl) return 4;
  if (width >= BREAKPOINTS.lg) return 3;
  if (width >= BREAKPOINTS.md) return 2;
  return 1;
}

export function useColumns(): number {
  const [columns, setColumns] = useState(() =>
    getColumnsForWidth(window.innerWidth),
  );

  useEffect(() => {
    function handleResize() {
      setColumns(getColumnsForWidth(window.innerWidth));
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return columns;
}
