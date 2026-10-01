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

const HomePage = () => {
  const { data: employees = [], isLoading, isError, error } = useEmployees();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const listBodyRef = useRef<HTMLDivElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);
  const pageSize = useFitRows({
    bodyRef: listBodyRef,
    footerRef: paginationRef,
    minRows: 3,
  });

  const { handleDelete, handleEdit, isDeleting, isDeleteError } =
    useEmployeeActions();

  // Reset here rather than in an effect: a new search should show its first
  // results, and doing it on the event avoids an extra render pass.
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const filteredEmployees = employees.filter((emp) =>
    `${emp.firstName} ${emp.middleName} ${emp.lastName}`
      .toLowerCase()
      .replaceAll("  ", " ")
      .includes(searchTerm.toLowerCase()),
  );

  // Clamp rather than reset, so resizing the window keeps you roughly where
  // you were instead of throwing you back to page 1.
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
