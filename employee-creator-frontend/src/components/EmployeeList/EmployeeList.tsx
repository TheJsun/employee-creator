import type { EmployeeResponse } from "../../schemas/employee-schema";
import EmployeeCard from "../EmployeeCard/EmployeeCard";
import classes from "./EmployeeList.module.scss";

interface EmployeeListProps {
  employees: EmployeeResponse[];
  onEdit: (employee: EmployeeResponse) => void;
  onDelete: (id: number) => void;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export default function EmployeeList({
  employees,
  onEdit,
  onDelete,
  isLoading,
  isError,
  error,
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
      {!isLoading && employees.length === 0 && (
        <h4 className={classes.emptyListMessage}>
          No employees registered, add one above.
        </h4>
      )}
      {isError && (
        <span>
          <p className={classes.errorMessage}>Failed to fetch employees.</p>
          <p className={classes.errorMessage}>{error?.message}</p>
        </span>
      )}

      {isLoading ? (
        <p className={classes.loadingMessage}>Loading employees...</p>
      ) : (
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
      )}
    </section>
  );
}
