import Button from "../../components/Button/Button";
import EmployeeList from "../../components/EmployeeList/EmployeeList";
import { useDeleteEmployee, useEmployees } from "../../hooks/useEmployees";
import { useNavigate } from "react-router";
import classes from "./HomePage.module.scss";
import Header from "../../components/Header/Header";
import { useEffect, useState } from "react";
import Pagination from "../../components/Pagination/Pagination";
import SearchBar from "../../components/SearchBar/SearchBar";
import { useColumns } from "../../hooks/useBreakpoints";
import { useEmployeeActions } from "../../hooks/useEmployeeActions";

const ROWS_PER_PAGE = 5;

const HomePage = () => {
  const { data: employees, isLoading, isError, error } = useEmployees();
  const deleteEmployeeMutation = useDeleteEmployee();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const columns = useColumns();
  const pageSize = columns * ROWS_PER_PAGE;

  const { handleDelete, handleEdit, isDeleting } = useEmployeeActions();

  useEffect(() => {
    setCurrentPage(1);
  }, [columns, searchTerm]);

  if (isLoading) {
    return <p className={classes.loadingMessage}>Loading...</p>;
  }
  if (isError) {
    return <p>Error: {error.message}</p>;
  }

  const filteredEmployees = employees!.filter((emp) =>
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

  console.log(paginatedEmployees);

  return (
    <main className={classes.homepage}>
      <Header
        title="Employees"
        action={
          <Button variant="accent" onClick={() => navigate("/employees/new")}>
            Add Employee
          </Button>
        }
      />
      <section className={classes.content}>
        <div className={classes.contentInner}>
          <SearchBar
            placeholder="Search for employee..."
            value={searchTerm}
            onChange={setSearchTerm}
          />
          <EmployeeList
            employees={paginatedEmployees}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        </div>
        {deleteEmployeeMutation.isPending && (
          <p className={classes.loadingMessage}>Deleting employee...</p>
        )}
      </section>
      {isDeleting && <p>Deleting employee...</p>}
      <Pagination
        currentPage={currentPage}
        totalItems={employees!.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />
    </main>
  );
};

export default HomePage;
