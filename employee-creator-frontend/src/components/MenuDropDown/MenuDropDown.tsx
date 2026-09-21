import { useEffect, useRef, useState } from "react";
import classes from "./MenuDropDown.module.scss";
import type { EmployeeResponse } from "../../schemas/employee-schema";

interface MenuDropDownProps {
  employee: EmployeeResponse;
  onDelete: (id: number) => void;
  onEdit: (employee: EmployeeResponse) => void;
}

export function MenuDropdown({
  employee,
  onDelete,
  onEdit,
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
      <div className={classes.menuContainer} ref={menuRef}>
        <button
          className={classes.menuTrigger}
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
