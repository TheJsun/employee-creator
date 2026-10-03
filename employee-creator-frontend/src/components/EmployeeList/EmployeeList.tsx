import type { Ref } from "react";
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
  listBodyRef?: Ref<HTMLDivElement>;
}

export default function EmployeeList({
  employees,
  onEdit,
  onDelete,
  isLoading,
  isError,
  error,
  listBodyRef,
}: EmployeeListProps) {
  return (
    <section className={classes.employeeListContainer}>
      <header className={classes.employeeListHeader}>
        <p>Name</p>
        <p>Department</p>
        <p className={classes.type}>Employment</p>
        <p className={classes.contract}>Contract</p>
        <p className={classes.started}>Started</p>
        <p></p>
      </header>
      <div className={classes.employeeList} ref={listBodyRef}>
        {isLoading && (
          <p className={classes.loadingMessage}>Loading employees...</p>
        )}

        {isError && (
          <div>
            <p className={classes.errorMessage}>Failed to fetch employees.</p>
            <p className={classes.errorMessage}>{error?.message}</p>
          </div>
        )}

        {!isLoading && !isError && employees.length === 0 && (
          <h4 className={classes.emptyListMessage}>
            No employees registered, add one above.
          </h4>
        )}

        {!isLoading &&
          !isError &&
          employees.map((emp) => (
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
