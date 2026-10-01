import Button from "../../components/Button/Button";
import EmployeeList from "../../components/EmployeeList/EmployeeList";
import { useEmployees } from "../../hooks/useEmployees";
import { useNavigate } from "react-router";
import classes from "./HomePage.module.scss";
import HomeHeader from "../../components/Header/HomeHeader";
import { useEffect, useState } from "react";
import Pagination from "../../components/Pagination/Pagination";
import SearchBar from "../../components/SearchBar/SearchBar";
import { useColumns } from "../../hooks/useBreakpoints";
import { useEmployeeActions } from "../../hooks/useEmployeeActions";

const ROWS_PER_PAGE = 5;

const HomePage = () => {
  const { data: employees = [], isLoading, isError, error } = useEmployees();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const columns = useColumns();
  const pageSize = columns * ROWS_PER_PAGE;

  const { handleDelete, handleEdit, isDeleting, isDeleteError } =
    useEmployeeActions();

  useEffect(() => {
    setCurrentPage(1);
  }, [columns, searchTerm]);

  const filteredEmployees = employees.filter((emp) =>
    `${emp.firstName} ${emp.middleName} ${emp.lastName}`
      .toLowerCase()
      .replaceAll("  ", " ")
      .includes(searchTerm.toLowerCase()),
  );

  const startIndex = (currentPage - 1) * pageSize;

  const paginatedEmployees = filteredEmployees?.slice(
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
            onChange={setSearchTerm}
          />
          <EmployeeList
            employees={paginatedEmployees}
            onDelete={handleDelete}
            onEdit={handleEdit}
            isLoading={isLoading}
            isError={isError}
            error={error}
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
        currentPage={currentPage}
        totalItems={employees.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />
    </main>
  );
};

export default HomePage;
