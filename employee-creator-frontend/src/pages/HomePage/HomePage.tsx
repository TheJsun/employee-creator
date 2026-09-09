import Button from "../../components/Button/Button";
import EmployeeList from "../../components/EmployeeList/EmployeeList";
import { useDeleteEmployee, useEmployees } from "../../hooks/useEmployees";
import { useNavigate } from "react-router";
import classes from "./HomePage.module.scss";
import Header from "../../components/Header/Header";
import type { EmployeeResponse } from "../../schemas/employee-schema";

const HomePage = () => {
  const { data: employees, isLoading, isError, error } = useEmployees();
  const deleteEmployeeMutation = useDeleteEmployee();
  const navigate = useNavigate();

  const handleDelete = (id: number) => {
    deleteEmployeeMutation.mutate(id);
  };

  const handleEdit = (employee: EmployeeResponse) => {
    navigate(`/employees/edit/${employee.id}`);
  };

  if (isLoading) {
    return <p className={classes.loadingMessage}>Loading...</p>;
  }
  if (isError) {
    return <p>Error: {error.message}</p>;
  }
  return (
    <main className={classes.homepage}>
      <Header title="Employees' list" />
      <section className={classes.content}>
        <div className={classes.addEmployeeCard}>
          <p>Please click on 'Edit' to find more details of each employee.</p>
          <Button onClick={() => navigate("/employees/new")}>
            Add Employee
          </Button>
        </div>

        <EmployeeList
          employees={employees!}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
        {deleteEmployeeMutation.isPending && (
          <p className={classes.loadingMessage}>Deleting employee...</p>
        )}
      </section>
    </main>
  );
};

export default HomePage;
