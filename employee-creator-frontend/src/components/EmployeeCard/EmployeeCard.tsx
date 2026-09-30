import type { EmployeeResponse } from "../../schemas/employee-schema";
import classes from "./EmployeeCard.module.scss";
import { EmployeeAvatar } from "../EmployeeAvatar/EmployeeAvatar";
import { MenuDropdown } from "../MenuDropDown/MenuDropDown";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  return (
    <article
      className={classes.employeeCard}
      onClick={() => navigate(`/employees/${employee.id}`)}
    >
      <div className={classes.employeeIdentity}>
        <EmployeeAvatar size="sm" employee={employee} />
        <p className={classes.employeeIdentity__name}>
          {employee.firstName} {employee?.middleName} {employee.lastName}
        </p>
      </div>

      <p>{employee.department?.name ?? "—"}</p>
      <MenuDropdown employee={employee} onDelete={onDelete} onEdit={onEdit} />
    </article>
  );
}
