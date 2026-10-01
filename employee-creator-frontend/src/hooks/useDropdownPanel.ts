import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

const PANEL_OFFSET = 4;
const VIEWPORT_GUTTER = 16;

interface UseDropdownPanelOptions {
  align?: "left" | "right";
}

export function useDropdownPanel({
  align = "left",
}: UseDropdownPanelOptions = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [panelStyle, setPanelStyle] = useState<CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const positionPanel = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const panelWidth = panelRef.current?.offsetWidth ?? rect.width;
    const maxLeft = window.innerWidth - panelWidth - VIEWPORT_GUTTER;
    const preferredLeft =
      align === "right" ? rect.right - panelWidth : rect.left;

    setPanelStyle({
      top: rect.bottom + PANEL_OFFSET,
      left: Math.max(VIEWPORT_GUTTER, Math.min(preferredLeft, maxLeft)),
      minWidth: rect.width,
      maxHeight:
        window.innerHeight - rect.bottom - PANEL_OFFSET - VIEWPORT_GUTTER,
    });
  }, [align]);

  useLayoutEffect(() => {
    if (isOpen) positionPanel();
  }, [isOpen, positionPanel]);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", positionPanel);
    window.addEventListener("scroll", positionPanel, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", positionPanel);
      window.removeEventListener("scroll", positionPanel, true);
    };
  }, [isOpen, positionPanel]);

  return {
    isOpen,
    setIsOpen,
    containerRef,
    triggerRef,
    panelRef,
    panelStyle,
  };
}
