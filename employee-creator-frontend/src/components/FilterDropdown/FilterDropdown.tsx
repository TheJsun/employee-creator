import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import classes from "./FilterDropdown.module.scss";

const PANEL_OFFSET = 4;
const VIEWPORT_GUTTER = 16;

export interface FilterOption {
  value: string;
  label: string;
  count: number;
}

interface FilterDropdownProps {
  label: string;
  allLabel: string;
  allCount: number;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function FilterDropdown({
  label,
  allLabel,
  allCount,
  options,
  value,
  onChange,
  disabled = false,
}: FilterDropdownProps) {
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

    setPanelStyle({
      top: rect.bottom + PANEL_OFFSET,
      left: Math.max(VIEWPORT_GUTTER, Math.min(rect.left, maxLeft)),
      minWidth: rect.width,
      maxHeight:
        window.innerHeight - rect.bottom - PANEL_OFFSET - VIEWPORT_GUTTER,
    });
  }, []);

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

  const selected = options.find((option) => option.value === value);

  const rows: FilterOption[] = [
    { value: "", label: allLabel, count: allCount },
    ...options,
  ];

  return (
    <div className={classes.container} ref={containerRef}>
      <button
        type="button"
        ref={triggerRef}
        className={classes.trigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={selected ? `${label}: ${selected.label}` : label}
        disabled={disabled}
      >
        {selected ? selected.label : label}
        <svg
          className={classes.chevron}
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div
          className={classes.panel}
          ref={panelRef}
          style={panelStyle}
          role="listbox"
          aria-label={label}
        >
          {rows.map((option) => (
            <button
              key={option.value === "" ? "__all" : option.value}
              type="button"
              role="option"
              aria-selected={option.value === value}
              className={
                option.value === value
                  ? `${classes.option} ${classes.optionSelected}`
                  : classes.option
              }
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              <span>{option.label}</span>
              <span className={classes.optionCount}>{option.count}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
