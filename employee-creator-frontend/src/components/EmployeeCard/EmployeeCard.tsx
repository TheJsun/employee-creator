import type { EmployeeResponse } from "../../schemas/employee-schema";
import Button from "../Button/Button";
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
  return (
    <article className={classes.employeeCard}>
      <div className={classes.employeeCard__info}>
        <p className={classes.employee__name}>
          {employee.firstName} {employee?.middleName} {employee.lastName}
        </p>
        <p className={classes.employee__contractType}>
          {employee.contractType} - numYears
        </p>
        <p className={classes.employee__email}>{employee.email}</p>
      </div>
      <div className={classes.employeeCard__btns}>
        <Button children={<p>Edit</p>} onClick={() => onEdit(employee)} />
        <Button
          children={<p>Remove</p>}
          onClick={() => onDelete(employee.id)}
        />
      </div>
    </article>
  );
}
