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
  /** Measured by HomePage to work out how many rows fit on a page. */
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
        <p className={classes.type}>Type</p>
        <p className={classes.contract}>Contract</p>
        <p className={classes.started}>Started</p>
        <p></p>
      </header>

      {/*
        Always rendered, and every state lives inside it, so its top edge is
        the one thing useFitRows can trust: it moves neither with the number of
        rows (they lay out below it) nor with which message is showing.
      */}
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
