import type { EmployeeResponse } from "../../schemas/employee-schema";
import Button from "../Button/Button";

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
    <article>
      <p>
        {employee.firstName} {employee?.middleName} {employee.lastName}
      </p>
      <p>{employee.contractType} - numYears</p>
      <p>{employee.email}</p>
      <Button children={<p>Edit</p>} onClick={() => onEdit(employee)} />
      <Button children={<p>Remove</p>} onClick={() => onDelete(employee.id)} />
    </article>
  );
}
