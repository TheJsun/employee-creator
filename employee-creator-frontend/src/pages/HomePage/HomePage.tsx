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
import { getFullName } from "../../services/employee-profile";
import { useDepartments } from "../../hooks/useDepartments";

const EMPLOYMENT_TYPES = ["FULL_TIME", "PART_TIME"] as const;
const CONTRACT_TYPES = ["PERMANENT", "CONTRACT"] as const;

const HomePage = () => {
  const { data: employees = [], isLoading, isError, error } = useEmployees();
  const {
    data: departments,
    isLoading: isDepartmentsLoading,
    isError: isDepartmentsError,
  } = useDepartments();

  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [department, setDepartment] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [contractType, setContractType] = useState("");

  const listBodyRef = useRef<HTMLDivElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);
  const pageSize = useFitRows({
    bodyRef: listBodyRef,
    footerRef: paginationRef,
    minRows: 3,
  });

  const { handleDelete, handleEdit, isDeleting, isDeleteError } =
    useEmployeeActions();

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const query = searchTerm.trim().toLowerCase();

  const searchedEmployees = query
    ? employees.filter((emp) =>
        [getFullName(emp), emp.jobRole, emp.email]
          .join(" ")
          .toLowerCase()
          .includes(query),
      )
    : employees;

  const filteredEmployees = searchedEmployees.filter(
    (emp) =>
      (department === "" || emp.department.name == department) &&
      (employmentType === "" || emp.employmentType === employmentType) &&
      (contractType === "" || emp.contractType === contractType),
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredEmployees.length / pageSize),
  );
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;

  const paginatedEmployees = filteredEmployees.slice(
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
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <div>
            <select
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
              }}
            >
              <option value="">All departments</option>
              {departments?.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}{" "}
            </select>
            <select
              value={employmentType}
              onChange={(e) => {
                setEmploymentType(e.target.value);
              }}
            >
              <option value="">All employments</option>
              {EMPLOYMENT_TYPES.map((employment) => (
                <option key={employment} value={employment}>
                  {employment}
                </option>
              ))}
            </select>
            <select
              value={contractType}
              onChange={(e) => {
                setContractType(e.target.value);
              }}
            >
              <option value="">All contracts</option>
              {CONTRACT_TYPES.map((contract) => (
                <option key={contract} value={contract}>
                  {contract}
                </option>
              ))}
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
        totalItems={filteredEmployees.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        containerRef={paginationRef}
      />
    </main>
  );
};

export default HomePage;
