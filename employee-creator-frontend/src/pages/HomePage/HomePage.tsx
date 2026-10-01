import Button from "../../components/Button/Button";
import EmployeeList from "../../components/EmployeeList/EmployeeList";
import { useEmployees } from "../../hooks/useEmployees";
import { useNavigate } from "react-router";
import classes from "./HomePage.module.scss";
import HomeHeader from "../../components/Header/HomeHeader";
import { useRef, useState } from "react";
import Pagination from "../../components/Pagination/Pagination";
import SearchBar from "../../components/SearchBar/SearchBar";
import { useFitRows } from "../../hooks/useFitRows";
import { useEmployeeActions } from "../../hooks/useEmployeeActions";
import {
  formatContractType,
  formatEmploymentType,
} from "../../services/employee-profile";
import { useDepartments } from "../../hooks/useDepartments";
import FilterDropdown from "../../components/FilterDropdown/FilterDropdown";
import {
  applyFilters,
  hasActiveFilters,
  EMPTY_FILTERS,
  type EmployeeFilters,
} from "../../services/employee-filters";

const EMPLOYMENT_TYPES = ["FULL_TIME", "PART_TIME"] as const;
const CONTRACT_TYPES = ["PERMANENT", "CONTRACT"] as const;

const HomePage = () => {
  const { data: employees = [], isLoading, isError, error } = useEmployees();
  const {
    data: departments = [],
    isLoading: isDepartmentsLoading,
    isError: isDepartmentsError,
  } = useDepartments();

  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<EmployeeFilters>(EMPTY_FILTERS);
  const [sortBy, setSortBy] = useState("date_added");

  const listBodyRef = useRef<HTMLDivElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);
  const pageSize = useFitRows({
    bodyRef: listBodyRef,
    footerRef: paginationRef,
    minRows: 3,
  });

  const { handleDelete, handleEdit, isDeleting, isDeleteError } =
    useEmployeeActions();

  const updateFilters = (changes: Partial<EmployeeFilters>) => {
    setFilters((prev) => ({ ...prev, ...changes }));
    setCurrentPage(1);
  };

  const filteredEmployees = applyFilters(employees, filters);
  const isFiltered = hasActiveFilters(filters);

  const countWith = (changes: Partial<EmployeeFilters>) =>
    applyFilters(employees, { ...filters, ...changes }).length;

  const departmentOptions = departments.map((d) => ({
    value: d.name,
    label: d.name,
    count: countWith({ department: d.name }),
  }));

  const employmentOptions = EMPLOYMENT_TYPES.map((type) => ({
    value: type,
    label: formatEmploymentType(type),
    count: countWith({ employmentType: type }),
  }));

  const contractOptions = CONTRACT_TYPES.map((type) => ({
    value: type,
    label: formatContractType(type),
    count: countWith({ contractType: type }),
  }));

  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    switch (sortBy) {
      case "dateAdded":
        return 0;

      case "name":
        return `${a.firstName} ${a.lastName}`.localeCompare(
          `${b.firstName} ${b.lastName}`,
        );

      case "department":
        return a.department.name.localeCompare(b.department.name);

      case "contractType":
        return a.contractType.localeCompare(b.contractType);

      case "employmentType":
        return a.employmentType.localeCompare(b.employmentType);

      default:
        return 0;
    }
  });

  const totalPages = Math.max(1, Math.ceil(sortedEmployees.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;

  const paginatedEmployees = sortedEmployees.slice(
    startIndex,
    startIndex + pageSize,
  );

  return (
    <main className={classes.homepage}>
      <HomeHeader
        title="Directory"
        action={
          <Button variant="accent" onClick={() => navigate("/employees/new")}>
            Add Employee
          </Button>
        }
        numEmployees={employees.length}
        isLoading={isLoading}
      />
      <section className={classes.content}>
        <div className={classes.contentInner}>
          <SearchBar
            placeholder="Search name, role or email"
            value={filters.search}
            onChange={(value) => updateFilters({ search: value })}
          />
          <div className={classes.filters}>
            <button
              type="button"
              className={
                isFiltered
                  ? classes.allButton
                  : `${classes.allButton} ${classes.allButtonActive}`
              }
              onClick={() => updateFilters(EMPTY_FILTERS)}
              disabled={!isFiltered}
              aria-label="Clear all filters"
            >
              All
            </button>
            <span className={classes.divider} aria-hidden="true" />
            <FilterDropdown
              label="Department"
              allLabel="All departments"
              allCount={countWith({ department: "" })}
              options={departmentOptions}
              value={filters.department}
              onChange={(value) => updateFilters({ department: value })}
              disabled={isDepartmentsLoading || isDepartmentsError}
            />
            <FilterDropdown
              label="Employment"
              allLabel="All employments"
              allCount={countWith({ employmentType: "" })}
              options={employmentOptions}
              value={filters.employmentType}
              onChange={(value) => updateFilters({ employmentType: value })}
            />
            <FilterDropdown
              label="Contract"
              allLabel="All contracts"
              allCount={countWith({ contractType: "" })}
              options={contractOptions}
              value={filters.contractType}
              onChange={(value) => updateFilters({ contractType: value })}
            />

            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="dateAdded">Dated Added</option>
              <option value="name">Name</option>
              <option value="department">Department</option>
              <option value="contractType">Contract type</option>
              <option value="employmentType">Employment type</option>
            </select>
          </div>

          <EmployeeList
            employees={paginatedEmployees}
            onDelete={handleDelete}
            onEdit={handleEdit}
            isLoading={isLoading}
            isError={isError}
            error={error}
            listBodyRef={listBodyRef}
          />
        </div>
      </section>
      {isDeleting && (
        <p className={classes.loadingMessage}>Deleting employee...</p>
      )}
      {isDeleteError && (
        <p className={classes.error}>
          Failed to delete employee. Please try again.
        </p>
      )}
      <Pagination
        currentPage={safePage}
        totalItems={sortedEmployees.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        containerRef={paginationRef}
      />
    </main>
  );
};

export default HomePage;
