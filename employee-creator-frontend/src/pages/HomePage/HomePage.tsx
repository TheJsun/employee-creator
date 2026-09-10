import Button from "../../components/Button/Button";
import EmployeeList from "../../components/EmployeeList/EmployeeList";
import { useDeleteEmployee, useEmployees } from "../../hooks/useEmployees";
import { useNavigate } from "react-router";
import classes from "./HomePage.module.scss";
import Header from "../../components/Header/Header";
import type { EmployeeResponse } from "../../schemas/employee-schema";
import { useState } from "react";
import Pagination from "../../components/Pagination/Pagination";

const HomePage = () => {
  const { data: employees, isLoading, isError, error } = useEmployees();
  const deleteEmployeeMutation = useDeleteEmployee();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  const handleDelete = (id: number) => {
    deleteEmployeeMutation.mutate(id);
  };

  const handleEdit = (employee: EmployeeResponse) => {
    navigate(`/employees/edit/${employee.id}`);
  };

  const startIndex = (currentPage - 1) * pageSize;
  console.log(employees);

  const paginatedEmployees = employees?.slice(
    startIndex,
    startIndex + pageSize,
  );

  if (isLoading) {
    return <p className={classes.loadingMessage}>Loading...</p>;
  }
  if (isError) {
    return <p>Error: {error.message}</p>;
  }
  return (
    <main className={classes.homepage}>
      <Header title="Employees" />
      <section className={classes.content}>
        <div className={classes.addEmployeeCard}>
          <p>Please click on 'Edit' to find more details of each employee.</p>
          <Button onClick={() => navigate("/employees/new")}>
            Add Employee
          </Button>
        </div>

        <EmployeeList
          employees={paginatedEmployees!}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
        {deleteEmployeeMutation.isPending && (
          <p className={classes.loadingMessage}>Deleting employee...</p>
        )}
      </section>
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
