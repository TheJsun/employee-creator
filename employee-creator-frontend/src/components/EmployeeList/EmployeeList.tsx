import type { EmployeeResponse } from "../../schemas/employee-schema";
import EmployeeCard from "../EmployeeCard/EmployeeCard";
import classes from "./EmployeeList.module.scss";

interface EmployeeListProps {
  employees: EmployeeResponse[];
  onEdit: (employee: EmployeeResponse) => void;
  onDelete: (id: number) => void;
}

export default function EmployeeList({
  employees,
  onEdit,
  onDelete,
}: EmployeeListProps) {
  return (
    <section className={classes.employeeListContainer}>
      <header className={classes.employeeListHeader}>
        <p>Name</p>
        <p>Department</p>
        <p className={classes.type}>Type</p>
        <p className={classes.contract}>Contract</p>
        <p className={classes.started}>Started</p>
        <p></p>
      </header>
      {employees.length === 0 && (
        <h4 className={classes.error}>
          No employees registered, add one above.
        </h4>
      )}
      <div className={classes.employeeList}>
        {employees.map((emp) => (
          <EmployeeCard
            key={emp.id}
            employee={emp}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </div>
    </section>
  );
}
