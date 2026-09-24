import type { EmployeeResponse } from "../../schemas/employee-schema";
import { getAvatarColor, getInitials } from "../../services/employee-profile";
import classes from "./EmployeeAvatar.module.scss";

interface EmployeeAvatarProps {
  employee: EmployeeResponse;
  size: "sm" | "md";
}

export function EmployeeAvatar({ size, employee }: EmployeeAvatarProps) {
  const initials = getInitials(employee.firstName, employee.lastName);
  const avatarColour = getAvatarColor(employee.email);
  return (
    <div className={`${classes.employeeAvatar} ${classes[size]}`}>
      <div
        className={classes.employeeAvatar__avatar}
        style={{ backgroundColor: avatarColour }}
      >
        <p className={classes.employeeAvatar__initials}>{initials}</p>
      </div>
    </div>
  );
}

//className={`${classes.btn} ${classes[variant]} ${className ?? ""}`.trim()}
