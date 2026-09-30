import { useEffect, useRef, useState } from "react";
import classes from "./MenuDropDown.module.scss";
import type { EmployeeResponse } from "../../schemas/employee-schema";

interface MenuDropDownProps {
  employee: EmployeeResponse;
  onDelete: (id: number) => void;
  onEdit: (employee: EmployeeResponse) => void;
  variant?: "light" | "dark";
}

export function MenuDropdown({
  employee,
  onDelete,
  onEdit,
  variant = "light",
}: MenuDropDownProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <>
      <div
        className={classes.menuContainer}
        ref={menuRef}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className={`${classes.menuTrigger} ${variant === "dark" ? classes.menuTriggerDark : ""}`.trim()}
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Employee actions"
          aria-expanded={isMenuOpen}
        >
          ⋮
        </button>

        {isMenuOpen && (
          <div className={classes.menuDropdown}>
            <button
              className={classes.menuItem}
              onClick={() => {
                setIsMenuOpen(false);
                onEdit(employee);
              }}
            >
              Edit
            </button>
            <button
              className={classes.menuItem}
              onClick={() => {
                setIsMenuOpen(false);
                onDelete(employee.id);
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </>
  );
}
