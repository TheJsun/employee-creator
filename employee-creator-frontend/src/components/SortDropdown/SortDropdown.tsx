import { useDropdownPanel } from "../../hooks/useDropdownPanel";
import classes from "./SortDropdown.module.scss";

export interface SortOption {
  value: string;
  label: string;
}

interface SortDropdownProps {
  label?: string;
  options: SortOption[];
  value: string;
  onChange: (value: string) => void;
}

export default function SortDropdown({
  label = "Sort by",
  options,
  value,
  onChange,
}: SortDropdownProps) {
  const {
    isOpen,
    setIsOpen,
    containerRef,
    triggerRef,
    panelRef,
    panelStyle,
  } = useDropdownPanel({ align: "right" });

  const selected = options.find((option) => option.value === value);

  return (
    <div className={classes.container} ref={containerRef}>
      <button
        type="button"
        ref={triggerRef}
        className={classes.trigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`${label}: ${selected?.label ?? ""}`}
      >
        <span className={classes.triggerLabel}>{label}</span>
        <span className={classes.triggerValue}>{selected?.label}</span>
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
          {options.map((option) => (
            <button
              key={option.value}
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
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
