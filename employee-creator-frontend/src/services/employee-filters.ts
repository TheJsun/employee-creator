import type { EmployeeResponse } from "../schemas/employee-schema";
import { getFullName } from "./employee-profile";

export interface EmployeeFilters {
  search: string;
  department: string;
  employmentType: string;
  contractType: string;
}

export const EMPTY_FILTERS: EmployeeFilters = {
  search: "",
  department: "",
  employmentType: "",
  contractType: "",
};

export function hasActiveFilters(filters: EmployeeFilters): boolean {
  return (
    filters.search.trim() !== "" ||
    filters.department !== "" ||
    filters.employmentType !== "" ||
    filters.contractType !== ""
  );
}

export function applyFilters(
  employees: EmployeeResponse[],
  filters: EmployeeFilters,
): EmployeeResponse[] {
  const query = filters.search.trim().toLowerCase();

  const searched = query
    ? employees.filter((emp) =>
        [getFullName(emp), emp.jobRole, emp.email]
          .join(" ")
          .toLowerCase()
          .includes(query),
      )
    : employees;

  return searched.filter(
    (emp) =>
      (filters.department === "" ||
        emp.department.name === filters.department) &&
      (filters.employmentType === "" ||
        emp.employmentType === filters.employmentType) &&
      (filters.contractType === "" ||
        emp.contractType === filters.contractType),
  );
}
