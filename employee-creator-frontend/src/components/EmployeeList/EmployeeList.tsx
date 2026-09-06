import type { EmployeeResponse } from "../../schemas/employee-schema";
import EmployeeCard from "../EmployeeCard/EmployeeCard";

interface EmployeeListProps {
  employees: EmployeeResponse[];
  onDelete: (id: number) => void;
}

export default function EmployeeList({
  employees,
  onDelete,
}: EmployeeListProps) {
  const handleEdit = () => {};

  return (
    <section>
      <ul>
        {employees.length === 0 && (
          <h4>No employees registered, add one above.</h4>
        )}
        {employees.map((emp) => (
          <EmployeeCard
            key={emp.id}
            employee={emp}
            onDelete={onDelete}
            onEdit={handleEdit}
          />
        ))}
      </ul>
    </section>
  );
}
