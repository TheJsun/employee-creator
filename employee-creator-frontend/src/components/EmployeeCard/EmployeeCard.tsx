import { useEffect, useRef, useState } from "react";
import type { EmployeeResponse } from "../../schemas/employee-schema";
import { getAvatarColor, getInitials } from "../../services/employee-profile";
import classes from "./EmployeeCard.module.scss";

interface EmployeeCardProps {
  employee: EmployeeResponse;
  onDelete: (id: number) => void;
  onEdit: (employee: EmployeeResponse) => void;
}

export default function EmployeeCard({
  employee,
  onDelete,
  onEdit,
}: EmployeeCardProps) {
  const initials = getInitials(employee.firstName, employee.lastName);
  const avatarColour = getAvatarColor(employee.email);
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
    <article className={classes.employeeCard}>
      <div className={classes.employeeIdentity}>
        <div
          className={classes.employeeIdentity__avatar}
          style={{ backgroundColor: avatarColour }}
        >
          <p className={classes.employeeIdentity__initials}>{initials}</p>
        </div>
        <p className={classes.employeeIdentity__name}>
          {employee.firstName} {employee?.middleName} {employee.lastName}
        </p>
      </div>

      <div className={classes.employmentDetails}>
        <div className={classes.employmentDetails__row}>
          <p>Contract Type:</p>
          <p>{employee.contractType}</p>
        </div>
        <div className={classes.employmentDetails__row}>
          <p>Employment Type</p>
          <p>{employee.fullTimeOrPartTime.replace(/_/g, " ")}</p>
        </div>
        <div className={classes.employmentDetails__row}>
          <p>Start Date:</p>
          <p>{employee.startDate}</p>
        </div>
        <div className={classes.employmentDetails__row}>
          <p>Finish date:</p>
          {employee.onGoing ? <p>On-going</p> : <p>{employee.finishDate}</p>}
        </div>
      </div>

      <div className={classes.employeeContacts}>
        <div className={classes.employeeContacts__row}>
          <img
            width="15"
            height="15"
            src="https://img.icons8.com/fluency-systems-regular/48/new-post.png"
            alt="new-post"
          />
          <p>{employee.email}</p>
        </div>
        <div className={classes.employeeContacts__row}>
          <img
            width="15"
            height="15"
            src="https://img.icons8.com/fluency-systems-regular/48/phone.png"
            alt="phone"
          />
          <p>{employee.phoneNumber}</p>
        </div>
      </div>
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
    </article>
  );
}
