import type { EmployeeResponse } from "../../schemas/employee-schema";
import { getAvatarColor, getInitials } from "../../services/employee-profile";
import classes from "./EmployeeAvatar.module.scss";

interface EmployeeAvatarProps {
  employee: EmployeeResponse;
}

export function EmployeeAvatar({ employee }: EmployeeAvatarProps) {
  const initials = getInitials(employee.firstName, employee.lastName);
  const avatarColour = getAvatarColor(employee.email);
  return (
    <div className={classes.employeeAvatar}>
      <div
        className={classes.employeeAvatar__avatar}
        style={{ backgroundColor: avatarColour }}
      >
        <p className={classes.employeeAvatar__initials}>{initials}</p>
      </div>
    </div>
  );
}
