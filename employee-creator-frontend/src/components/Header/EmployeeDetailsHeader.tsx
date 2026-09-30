import { Link } from "react-router-dom";
import Button from "../Button/Button";
import { EmployeeAvatar } from "../EmployeeAvatar/EmployeeAvatar";
import { MenuDropdown } from "../MenuDropDown/MenuDropDown";
import classes from "./EmployeeDetailsHeader.module.scss";
import type { EmployeeResponse } from "../../schemas/employee-schema";
import {
  formatContractType,
  formatEmploymentType,
} from "../../services/employee-profile";

interface EmployeeDetailsHeaderProps {
  employee: EmployeeResponse;
  onEdit: (employee: EmployeeResponse) => void;
  onDelete: (id: number) => void;
}

export default function EmployeeDetailsHeader({
  employee,
  onEdit,
  onDelete,
}: EmployeeDetailsHeaderProps) {
  const fullName = `${employee.firstName} ${employee.lastName}`;
  const subtitle = [
    employee.jobRole,
    employee.department?.name,
    `${formatEmploymentType(employee.employmentType)}, ${formatContractType(employee.contractType)}`,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <header className={classes.header}>
      <div className={classes.headerContent}>
        <nav aria-label="Breadcrumb" className={classes.breadcrumb}>
          <Link to="/">Directory</Link> / <span>{fullName}</span>
        </nav>
        <div className={classes.row}>
          <div className={classes.identity}>
            <EmployeeAvatar size="md" employee={employee} />
            <div className={classes.identity__text}>
              <h1 className={classes.name}>
                {employee.firstName} {employee.middleName} {employee.lastName}
              </h1>
              {subtitle && <p className={classes.subtitle}>{subtitle}</p>}
            </div>
          </div>
          <div className={classes.actions}>
            <Button variant="accent" onClick={() => onEdit(employee)}>
              Edit profile
            </Button>
            <MenuDropdown
              employee={employee}
              onDelete={onDelete}
              onEdit={onEdit}
              variant="dark"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
